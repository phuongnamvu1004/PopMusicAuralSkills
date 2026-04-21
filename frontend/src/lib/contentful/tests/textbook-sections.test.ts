import { describe, expect, it, vi } from 'vitest'

vi.mock('../graphql', () => ({
    contentfulGraphQLFetch: vi.fn(),
}))

import { contentfulGraphQLFetch } from '../graphql'
import { getTextbookSectionBySectionKey } from '../textbook-sections'

describe('textbookSection contentful queries', () => {
    it('fetches a textbook section by sectionKey', async () => {
        const mockedGraphQLFetch = vi.mocked(contentfulGraphQLFetch)

        mockedGraphQLFetch.mockResolvedValue({
            textbookSectionCollection: {
                items: [
                    {
                        sys: { id: 'section-1a' },
                        title: 'Level 1A: Scale Degrees 1, 2, 3',
                        description: 'Intro to scale degrees 1, 2, and 3.',
                        chapterNumber: 1,
                        sectionCode: 'A',
                        sectionKey: '1-a',
                        headerCaption: 'Start here',
                        practiceLinks: 'Practice 1',
                        exercises: {
                            sys: { id: 'exercise-1a' },
                            title: '1A Exercises',
                            chapterNumber: 1,
                            sectionCode: 'A',
                            sectionKey: '1-a',
                        },
                    },
                ],
            },
        })

        await expect(getTextbookSectionBySectionKey('1-a')).resolves.toEqual({
            sys: { id: 'section-1a' },
            title: 'Level 1A: Scale Degrees 1, 2, 3',
            description: 'Intro to scale degrees 1, 2, and 3.',
            chapterNumber: 1,
            sectionCode: 'A',
            sectionKey: '1-a',
            headerCaption: 'Start here',
            practiceLinks: 'Practice 1',
            exercises: {
                sys: { id: 'exercise-1a' },
                title: '1A Exercises',
                chapterNumber: 1,
                sectionCode: 'A',
                sectionKey: '1-a',
            },
        })

        expect(mockedGraphQLFetch).toHaveBeenCalledWith({
            query: expect.stringContaining(
                'textbookSectionCollection(limit: 1, where: { sectionKey: $value }, locale: $locale, preview: false)',
            ),
            variables: { value: '1-a', locale: undefined },
            preview: false,
        })
    })
})
