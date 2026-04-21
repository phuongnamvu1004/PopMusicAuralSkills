import { describe, expect, it, vi } from 'vitest'

vi.mock('../graphql', () => ({
    contentfulGraphQLFetch: vi.fn(),
}))

import { getExerciseMetaByExerciseId } from '../exercise-meta'
import { contentfulGraphQLFetch } from '../graphql'

describe('exerciseMeta contentful queries', () => {
    it('fetches exerciseMeta by exerciseId', async () => {
        const mockedGraphQLFetch = vi.mocked(contentfulGraphQLFetch)

        mockedGraphQLFetch.mockResolvedValue({
            exerciseMetaCollection: {
                items: [
                    {
                        sys: { id: 'meta-1' },
                        exerciseId: 'wmyb_1A',
                        source: 'https://example.com/source',
                        level: '1A',
                        key: 'E Major',
                        cue: 'Cue text',
                    },
                ],
            },
        })

        await expect(getExerciseMetaByExerciseId('wmyb_1A')).resolves.toEqual({
            sys: { id: 'meta-1' },
            exerciseId: 'wmyb_1A',
            source: 'https://example.com/source',
            level: '1A',
            key: 'E Major',
            cue: 'Cue text',
        })

        expect(mockedGraphQLFetch).toHaveBeenCalledWith({
            query: expect.stringContaining(
                'exerciseMetaCollection(limit: 1, where: { exerciseId: $value }, locale: $locale, preview: false)',
            ),
            variables: { value: 'wmyb_1A', locale: undefined },
            preview: false,
        })
    })
})
