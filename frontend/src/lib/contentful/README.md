General Contentful GraphQL helpers for the frontend.

Files:
- `graphql.ts`: low-level POST helper for Contentful's GraphQL endpoint.
- `queries.ts`: reusable methods for common collection and single-entry reads.

Expected env vars in `frontend/.env.local`:

```env
SPACE_ID="yvqrrbzwzgh3"
CDA_TOKEN="..."
```

Example usage:

```ts
import { getContentfulCollection, getContentfulEntryBySlug } from './queries'

const lessons = await getContentfulCollection<{
  title: string
  slug: string
}>({
  collectionName: 'lesson',
  fields: `
    title
    slug
  `,
  limit: 20,
})

const lesson = await getContentfulEntryBySlug<{
  title: string
  slug: string
  body: { json: unknown }
}>({
  collectionName: 'lesson',
  fields: `
    title
    slug
    body {
      json
    }
  `,
  slug: 'intro-to-intervals',
})
```

Notes:
- `collectionName` should match the GraphQL collection name in Contentful, for example `lesson` to query `lessonCollection`.
- `contentType` in `getContentfulEntryById` should match the GraphQL single-entry field name.
- These helpers run in the browser, so the delivery token is exposed to the frontend bundle.
