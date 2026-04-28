import { describe, expect, it, vi } from 'vitest'

vi.mock('../graphql', () => ({
    contentfulGraphQLFetch: vi.fn(),
}))

import { getAllExercises, getExerciseById, getExerciseBySectionKey } from '../exercises'
import { contentfulGraphQLFetch } from '../graphql'

describe('exercises contentful queries', () => {
    it('fetches the exercises collection from Contentful', async () => {
        const mockedGraphQLFetch = vi.mocked(contentfulGraphQLFetch)

        mockedGraphQLFetch.mockResolvedValue({
            exercisesCollection: {
                items: [
                    {
                        sys: { id: 'exercise-1' },
                        id: 'wmyb_1A',
                        title: 'Interval Recognition',
                        chapterNumber: 1,
                        sectionCode: 'A',
                        sectionKey: '1-a',
                    },
                ],
            },
        })

        await expect(getAllExercises()).resolves.toEqual([
            {
                sys: { id: 'exercise-1' },
                id: 'wmyb_1A',
                title: 'Interval Recognition',
                chapterNumber: 1,
                sectionCode: 'A',
                sectionKey: '1-a',
            },
        ])

        expect(mockedGraphQLFetch).toHaveBeenCalledWith({
            query: expect.stringContaining('exercisesCollection(limit: $limit, locale: $locale, preview: false)'),
            variables: { limit: 100, locale: undefined },
            preview: false,
        })
    })

    it('fetches a full exercise by sectionKey', async () => {
        const mockedGraphQLFetch = vi.mocked(contentfulGraphQLFetch)

        mockedGraphQLFetch.mockResolvedValue({
            exercisesCollection: {
                items: [
                    {
                        sys: { id: 'exercise-1' },
                        id: 'wmyb_1A',
                        title: '1A Exercises',
                        chapterNumber: 1,
                        sectionCode: 'A',
                        sectionKey: '1-a',
                        lines: [{ lineId: 'L1', blanks: ['L1_B1'], lyric: 'BA-' }],
                        renderStyle: 'underscores',
                        blankBox: { width: 64, height: 30, gap: 10 },
                        meta: {
                            exerciseId: 'wmyb_1A',
                            source: 'https://example.com/source',
                            level: '1A',
                            key: 'E Major',
                            cue: 'Cue text',
                        },
                        exerciseKey: {
                            exerciseId: 'wmyb_1A',
                            answersByLine: { L1: ['3'] },
                            answersById: { L1_B1: '3' },
                            grading: {
                                trim: true,
                                caseInsensitive: true,
                                allowedValues: ['1', '2', '3'],
                            },
                        },
                    },
                ],
            },
        })

        await expect(getExerciseBySectionKey('1-a')).resolves.toEqual({
            sys: { id: 'exercise-1' },
            id: 'wmyb_1A',
            title: '1A Exercises',
            chapterNumber: 1,
            sectionCode: 'A',
            sectionKey: '1-a',
            lines: [{ lineId: 'L1', blanks: ['L1_B1'], lyric: 'BA-' }],
            renderStyle: 'underscores',
            blankBox: { width: 64, height: 30, gap: 10 },
            meta: {
                exerciseId: 'wmyb_1A',
                source: 'https://example.com/source',
                level: '1A',
                key: 'E Major',
                cue: 'Cue text',
            },
            exerciseKey: {
                exerciseId: 'wmyb_1A',
                answersByLine: { L1: ['3'] },
                answersById: { L1_B1: '3' },
                grading: {
                    trim: true,
                    caseInsensitive: true,
                    allowedValues: ['1', '2', '3'],
                },
            },
        })

        expect(mockedGraphQLFetch).toHaveBeenCalledWith({
            query: expect.stringContaining(
                'exercisesCollection(limit: 1, where: { sectionKey: $value }, locale: $locale, preview: false)',
            ),
            variables: { value: '1-a', locale: undefined },
            preview: false,
        })
    })

    it('fetches a full exercise by unique exercise id', async () => {
        const mockedGraphQLFetch = vi.mocked(contentfulGraphQLFetch)

        mockedGraphQLFetch.mockResolvedValue({
            exercisesCollection: {
                items: [
                    {
                        sys: { id: 'exercise-1' },
                        id: 'wmyb_1A',
                        title: '1A Exercises',
                        chapterNumber: 1,
                        sectionCode: 'A',
                        sectionKey: '1-a',
                        lines: [{ lineId: 'L1', blanks: ['L1_B1'], lyric: 'BA-' }],
                        renderStyle: 'underscores',
                        blankBox: { width: 64, height: 30, gap: 10 },
                        meta: {
                            exerciseId: 'wmyb_1A',
                            source: 'https://example.com/source',
                            level: '1A',
                            key: 'E Major',
                            cue: 'Cue text',
                        },
                        exerciseKey: {
                            exerciseId: 'wmyb_1A',
                            answersByLine: { L1: ['3'] },
                            answersById: { L1_B1: '3' },
                            grading: {
                                trim: true,
                                caseInsensitive: true,
                                allowedValues: ['1', '2', '3'],
                            },
                        },
                    },
                ],
            },
        })

        await expect(getExerciseById('wmyb_1A')).resolves.toMatchObject({
            sys: { id: 'exercise-1' },
            id: 'wmyb_1A',
            title: '1A Exercises',
            meta: {
                exerciseId: 'wmyb_1A',
            },
            exerciseKey: {
                exerciseId: 'wmyb_1A',
            },
        })

        expect(mockedGraphQLFetch).toHaveBeenCalledWith({
            query: expect.stringContaining(
                'exercisesCollection(limit: 1, where: { id: $value }, locale: $locale, preview: false)',
            ),
            variables: { value: 'wmyb_1A', locale: undefined },
            preview: false,
        })
    })
})
