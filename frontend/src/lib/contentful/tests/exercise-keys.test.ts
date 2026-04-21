import { describe, expect, it, vi } from 'vitest'

vi.mock('../graphql', () => ({
    contentfulGraphQLFetch: vi.fn(),
}))

import { getExerciseKeyByExerciseId } from '../exercise-keys'
import { contentfulGraphQLFetch } from '../graphql'

describe('exerciseKey contentful queries', () => {
    it('fetches exerciseKey by exerciseId', async () => {
        const mockedGraphQLFetch = vi.mocked(contentfulGraphQLFetch)

        mockedGraphQLFetch.mockResolvedValue({
            exerciseKeyCollection: {
                items: [
                    {
                        sys: { id: 'key-1' },
                        exerciseId: 'wmyb_1A',
                        answersByLine: { L1: ['3'] },
                        answersById: { L1_B1: '3' },
                        grading: {
                            trim: true,
                            caseInsensitive: true,
                            allowedValues: ['1', '2', '3'],
                        },
                    },
                ],
            },
        })

        await expect(getExerciseKeyByExerciseId('wmyb_1A')).resolves.toEqual({
            sys: { id: 'key-1' },
            exerciseId: 'wmyb_1A',
            answersByLine: { L1: ['3'] },
            answersById: { L1_B1: '3' },
            grading: {
                trim: true,
                caseInsensitive: true,
                allowedValues: ['1', '2', '3'],
            },
        })

        expect(mockedGraphQLFetch).toHaveBeenCalledWith({
            query: expect.stringContaining(
                'exerciseKeyCollection(limit: 1, where: { exerciseId: $value }, locale: $locale, preview: false)',
            ),
            variables: { value: 'wmyb_1A', locale: undefined },
            preview: false,
        })
    })
})
