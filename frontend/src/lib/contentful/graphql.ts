type GraphQLVariables = Record<string, unknown>

type GraphQLError = {
    message: string
    path?: Array<string | number>
    extensions?: Record<string, unknown>
}

type GraphQLResponse<TData> = {
    data?: TData
    errors?: GraphQLError[]
}

const CONTENTFUL_SPACE_ID = import.meta.env.SPACE_ID
const CONTENTFUL_CDA_TOKEN = import.meta.env.CDA_TOKEN

const assertContentfulEnv = () => {
    if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_CDA_TOKEN) {
        throw new Error(
            'Missing Contentful configuration. Set SPACE_ID and CDA_TOKEN in frontend/.env.local.',
        )
    }
}

export const getContentfulGraphQLEndpoint = (preview = false) => {
    assertContentfulEnv()

    const host = preview ? 'preview.contentful.com' : 'graphql.contentful.com'

    return `https://${host}/content/v1/spaces/${CONTENTFUL_SPACE_ID}`
}

export const contentfulGraphQLFetch = async <
    TData,
    TVariables extends GraphQLVariables = GraphQLVariables,
>(
    {
        query,
        variables,
        preview = false,
        tags,
    }: {
        query: string
        variables?: TVariables
        preview?: boolean
        tags?: string[]
    },
): Promise<TData> => {
    assertContentfulEnv()

    const response = await fetch(getContentfulGraphQLEndpoint(preview), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CONTENTFUL_CDA_TOKEN}`,
        },
        body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
        throw new Error(`Contentful GraphQL request failed with ${response.status} ${response.statusText}`)
    }

    const payload = (await response.json()) as GraphQLResponse<TData>

    if (payload.errors?.length) {
        const details = payload.errors.map((error) => error.message).join('; ')
        throw new Error(`Contentful GraphQL returned errors: ${details}`)
    }

    if (!payload.data) {
        throw new Error('Contentful GraphQL returned no data.')
    }

    if (tags?.length) {
        console.debug('Contentful GraphQL tags:', tags)
    }

    return payload.data
}
