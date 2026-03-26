const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface FetchOptions {
  method?: string;
  body?: unknown;
  apiKey?: string;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.apiKey) {
    headers["X-API-Key"] = options.apiKey;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "POST",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message ?? `API error: ${response.status}`);
  }

  return data as T;
}
