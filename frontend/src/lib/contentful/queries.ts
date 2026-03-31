import { contentfulGraphQLFetch } from './graphql'

type Sys = {
    id: string
}

type EntryFields = Record<string, unknown>

type CollectionResponse<TFields extends EntryFields> = {
    items: Array<{
        sys: Sys
    } & TFields>
}

type EntryResponse<TFields extends EntryFields> = {
    sys: Sys
} & TFields

export const getContentfulCollection = async <TFields extends EntryFields,>({
    collectionName,
    fields,
    limit = 10,
    locale,
    preview = false,
}: {
    collectionName: string
    fields: string
    limit?: number
    locale?: string
    preview?: boolean
}) => {
    const query = `
    query GetCollection($limit: Int!, $locale: String) {
        ${collectionName}Collection(limit: $limit, locale: $locale, preview: ${preview}) {
            items {
                sys {
                    id
                }
                ${fields}
            }
        }
    }`

    const data = await contentfulGraphQLFetch<Record<string, CollectionResponse<TFields>>>({
        query,
        variables: { limit, locale },
        preview,
    })

    return data[`${collectionName}Collection`]?.items ?? []
}

export const getContentfulEntryBySlug = async <TFields extends EntryFields,>({
    collectionName,
    fields,
    slug,
    locale,
    preview = false,
}: {
    collectionName: string
    fields: string
    slug: string
    locale?: string
    preview?: boolean
}) => {
    const query = `
    query GetEntryBySlug($slug: String!, $locale: String) {
        ${collectionName}Collection(limit: 1, where: { slug: $slug }, locale: $locale, preview: ${preview}) {
            items {
                sys {
                    id
                }
                ${fields}
            }
        }
    }`

    const data = await contentfulGraphQLFetch<Record<string, CollectionResponse<TFields>>>({
        query,
        variables: { slug, locale },
        preview,
    })

    return data[`${collectionName}Collection`]?.items[0] ?? null
}

export const getContentfulEntryById = async <TFields extends EntryFields,>({
    contentType,
    fields,
    id,
    locale,
    preview = false,
}: {
    contentType: string
    fields: string
    id: string
    locale?: string
    preview?: boolean
}) => {
    const query = `
    query GetEntryById($id: String!, $locale: String) {
        ${contentType}(id: $id, locale: $locale, preview: ${preview}) {
            sys {
                id
            }
            ${fields}
        }
    }`

    const data = await contentfulGraphQLFetch<Record<string, EntryResponse<TFields> | null>>({
        query,
        variables: { id, locale },
        preview,
    })

    return data[contentType] ?? null
}
