import type {
  EnrichRequest,
  EnrichResponse,
  EnrichBatchRequest,
  BatchJobResponse,
  JobStatusResponse,
  IngestRequest,
  ParseResponse,
  NormalizeOnlyResponse,
  ApiError,
  PublishRequest,
  PublishResponse,
  CreateSubscription,
  UpdateSubscription,
  WebhookSubscription,
} from "@orgo-sync/schemas";

interface OrgoSyncOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface SubscriptionCreateResponse extends Omit<WebhookSubscription, "failure_count" | "disabled_at" | "updated_at"> {
  signing_secret: string;
}

export interface SubscriptionListResponse {
  subscriptions: WebhookSubscription[];
}

export interface SubscriptionDetailResponse {
  subscription: WebhookSubscription;
  recent_deliveries: Array<Record<string, unknown>>;
}

export interface CreateFeedResponse {
  success: boolean;
  feed: {
    id: string;
    name: string;
    token: string;
    subscribe_url: string;
    created_at: string;
  };
}

export interface FeedEventInput {
  external_id?: string;
  canonical_event: Record<string, unknown>;
  logistics?: Record<string, unknown> | null;
}

export interface PushToFeedResponse {
  success: boolean;
  feed_id: string;
  inserted: number;
  updated: number;
  total_events: number;
}

export class OrgoSync {
  private apiKey: string;
  private baseUrl: string;

  constructor(options: OrgoSyncOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? "https://api.orgosync.com").replace(
      /\/$/,
      ""
    );
  }

  async enrich(input: EnrichRequest): Promise<EnrichResponse | NormalizeOnlyResponse> {
    return this.post<EnrichResponse | NormalizeOnlyResponse>("/v1/enrich", input);
  }

  async enrichBatch(input: EnrichBatchRequest): Promise<BatchJobResponse | NormalizeOnlyResponse> {
    return this.post<BatchJobResponse | NormalizeOnlyResponse>("/v1/enrich/batch", input);
  }

  async ingest(input: IngestRequest): Promise<EnrichResponse | NormalizeOnlyResponse | BatchJobResponse> {
    return this.post<EnrichResponse | NormalizeOnlyResponse | BatchJobResponse>("/v1/ingest", input);
  }

  async parse(ics: string): Promise<ParseResponse> {
    return this.post<ParseResponse>("/v1/parse", { ics });
  }

  async status(jobId: string): Promise<JobStatusResponse> {
    return this.get<JobStatusResponse>(`/v1/enrich/${jobId}`);
  }

  async createFeed(options: {
    name: string;
    branding?: { footer?: string };
  }): Promise<CreateFeedResponse> {
    return this.post<CreateFeedResponse>("/v1/feeds", options);
  }

  async pushToFeed(
    feedId: string,
    events: FeedEventInput[]
  ): Promise<PushToFeedResponse> {
    return this.post<PushToFeedResponse>(`/v1/feeds/${feedId}/events`, {
      events,
    });
  }

  async publish(input: PublishRequest): Promise<PublishResponse> {
    return this.post<PublishResponse>("/v1/publish", input);
  }

  async createSubscription(input: CreateSubscription): Promise<SubscriptionCreateResponse> {
    return this.post<SubscriptionCreateResponse>("/v1/subscriptions", input);
  }

  async listSubscriptions(): Promise<SubscriptionListResponse> {
    return this.get<SubscriptionListResponse>("/v1/subscriptions");
  }

  async getSubscription(id: string): Promise<SubscriptionDetailResponse> {
    return this.get<SubscriptionDetailResponse>(`/v1/subscriptions/${id}`);
  }

  async updateSubscription(id: string, input: UpdateSubscription): Promise<WebhookSubscription & { signing_secret?: string }> {
    return this.patch<WebhookSubscription & { signing_secret?: string }>(`/v1/subscriptions/${id}`, input);
  }

  async deleteSubscription(id: string): Promise<void> {
    await this.del(`/v1/subscriptions/${id}`);
  }

  async testSubscription(id: string): Promise<{ success: boolean; delivery_id: string; message: string }> {
    return this.post<{ success: boolean; delivery_id: string; message: string }>(`/v1/subscriptions/${id}/test`, {});
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      throw new OrgoSyncError(
        error.error.message,
        error.error.code,
        response.status,
        error.error.details
      );
    }

    return response.json() as Promise<T>;
  }

  private async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: {
        "X-API-Key": this.apiKey,
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      throw new OrgoSyncError(
        error.error.message,
        error.error.code,
        response.status,
        error.error.details
      );
    }

    return response.json() as Promise<T>;
  }

  private async patch<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      throw new OrgoSyncError(
        error.error.message,
        error.error.code,
        response.status,
        error.error.details
      );
    }

    return response.json() as Promise<T>;
  }

  private async del(path: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": this.apiKey,
      },
    });

    if (!response.ok && response.status !== 204) {
      const error = (await response.json()) as ApiError;
      throw new OrgoSyncError(
        error.error.message,
        error.error.code,
        response.status,
        error.error.details
      );
    }
  }
}

export class OrgoSyncError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: unknown
  ) {
    super(message);
    this.name = "OrgoSyncError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
