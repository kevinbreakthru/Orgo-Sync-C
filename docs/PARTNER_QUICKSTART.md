# Partner Quickstart Guide

Get started with the Orgo Sync API in under 5 minutes.

## 1. Create Your Account

Sign up at the [Developer Portal](https://portal.orgosync.com/signup) with your organization name and email.

## 2. Generate an API Key

Navigate to **Dashboard → API Keys** and click **Generate New Key**.

- **Sandbox keys** (`sk_test_*`) return instant mock data — no API credits consumed
- **Production keys** (`sk_live_*`) make real geocoding, routing, and weather calls

Store your key securely. It is shown only once.

## 3. Make Your First Call

### Using cURL

```bash
curl -X POST https://api.orgosync.com/v1/enrich \
  -H "X-API-Key: sk_test_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "U12 Soccer vs Eagles",
    "start": "2026-03-28T14:00:00-05:00",
    "end": "2026-03-28T15:30:00-05:00",
    "location": "Memorial Stadium, Springfield IL",
    "origin": { "address": "456 Elm St, Springfield IL" }
  }'
```

### Using the SDK

```bash
npm install @orgo/sync
```

```typescript
import { OrgoSync } from '@orgo/sync';

const orgo = new OrgoSync({ apiKey: 'sk_test_YOUR_KEY' });
const result = await orgo.enrich({
  title: 'U12 Soccer vs Eagles',
  start: '2026-03-28T14:00:00-05:00',
  end: '2026-03-28T15:30:00-05:00',
  location: 'Memorial Stadium, Springfield IL',
  origin: { address: '456 Elm St, Springfield IL' },
});

console.log(result.data.enrichment.timeline.depart_by);
```

## 4. Understand the Response

The enriched Logistics Object includes:

- **Geocoded Location**: Resolved address, place ID, coordinates
- **Drive Time**: Distance, duration, traffic-aware ETA
- **Weather**: Conditions at event start/end, precipitation chance, UV index
- **Timeline**: When to prep, depart, and arrive
- **Conflicts**: Overlap with other events in your schedule

## 5. Explore More

| Endpoint             | Description                                      |
| -------------------- | ------------------------------------------------ |
| `POST /v1/enrich`    | Enrich a single structured event                 |
| `POST /v1/ingest`    | Ingest native JSON from TeamSnap, ICS, or raw    |
| `POST /v1/parse`     | Parse ICS text into canonical events              |
| `POST /v1/enrich/batch` | Enrich multiple events asynchronously         |
| `GET /v1/enrich/:jobId` | Check async job status                        |

## 6. TeamSnap Integration

If you use TeamSnap, send native event data directly:

```typescript
const result = await orgo.ingest({
  source: 'teamsnap',
  enrich: true,
  payload: {
    id: 12345,
    name: 'Practice',
    team_name: 'Springfield Thunder U12',
    start_date: '2026-03-28T16:00:00-05:00',
    end_date: '2026-03-28T17:30:00-05:00',
    location_name: 'Lincoln Park Field 3',
    is_game: false,
  },
  origin: { address: '456 Elm St, Springfield IL' },
});
```

## Rate Limits

| Key Type   | Limit         |
| ---------- | ------------- |
| Sandbox    | 100 req/min   |
| Production | 60 req/min    |

Rate limit headers are included in every response. If exceeded, you will receive a `429` with a `Retry-After` header.

## Support

For questions or integration help, reach out through the Developer Portal dashboard.
