# @orgo/sync

Orgo Sync SDK — Scheduling Intelligence for Sports.

Enrich any sports event with logistics, weather, drive times, prep timelines, and conflict detection in one API call.

## Install

```bash
npm install @orgo/sync
```

## Quick Start

```typescript
import { OrgoSync } from '@orgo/sync';

const orgo = new OrgoSync({ apiKey: 'sk_live_xxx' });
const result = await orgo.enrich({
  title: 'U12 Soccer vs Eagles',
  start: '2026-03-28T14:00:00-05:00',
  end: '2026-03-28T15:30:00-05:00',
  location: 'Memorial Stadium, 123 Oak St, Springfield IL',
  origin: { address: '456 Elm St, Springfield IL' },
});

console.log(result.data.enrichment.timeline.depart_by);
console.log(result.data.enrichment.weather?.at_event_start.condition);
```

## API

### `new OrgoSync(options)`

| Option    | Type     | Required | Description                            |
| --------- | -------- | -------- | -------------------------------------- |
| `apiKey`  | `string` | Yes      | Your API key (`sk_live_*` or `sk_test_*`) |
| `baseUrl` | `string` | No       | API base URL (defaults to production)  |

### Methods

#### `orgo.enrich(input): Promise<EnrichResponse>`

Enrich a single event with geocoding, drive time, weather, timeline, and conflict detection.

#### `orgo.enrichBatch(input): Promise<BatchJobResponse>`

Enrich multiple events asynchronously. Returns a job ID for polling.

#### `orgo.ingest(input): Promise<EnrichResponse | BatchJobResponse>`

Ingest native JSON from a platform adapter (TeamSnap, ICS, raw JSON) and optionally enrich.

#### `orgo.parse(ics): Promise<ParseResponse>`

Parse an ICS/iCal string into Orgo Canonical Events without enrichment.

#### `orgo.status(jobId): Promise<JobStatusResponse>`

Check the status of an async enrichment job.

## Sandbox Mode

Use `sk_test_*` keys to get instant mock responses without consuming API credits or hitting external services.

## Error Handling

```typescript
import { OrgoSyncError } from '@orgo/sync';

try {
  const result = await orgo.enrich({ ... });
} catch (error) {
  if (error instanceof OrgoSyncError) {
    console.error(error.code, error.message, error.statusCode);
  }
}
```
