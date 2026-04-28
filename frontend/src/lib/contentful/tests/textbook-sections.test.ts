import { describe, expect, it, vi } from 'vitest'

vi.mock('../graphql', () => ({
    contentfulGraphQLFetch: vi.fn(),
}))

import { contentfulGraphQLFetch } from '../graphql'
import { getTextbookSectionBySectionKey, getTextbookSections } from '../textbook-sections'

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
                        headerVisual: {
                            sys: { id: 'asset-1' },
                            url: '//images.ctfassets.net/example.png',
                            title: 'Section header',
                            description: 'Header image',
                            width: 1280,
                            height: 720,
                        },
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
            headerVisual: {
                sys: { id: 'asset-1' },
                url: '//images.ctfassets.net/example.png',
                title: 'Section header',
                description: 'Header image',
                width: 1280,
                height: 720,
            },
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

    it('fetches and sorts all textbook sections for generated navigation', async () => {
        const mockedGraphQLFetch = vi.mocked(contentfulGraphQLFetch)

        mockedGraphQLFetch.mockResolvedValue({
            textbookSectionCollection: {
                items: [
                    {
                        sys: { id: 'section-1b' },
                        title: 'Level 1B',
                        description: 'Next section.',
                        chapterNumber: 1,
                        sectionCode: 'B',
                        sectionKey: '1-b',
                        headerCaption: 'Second header caption',
                    },
                    {
                        sys: { id: 'section-1a' },
                        title: 'Level 1A',
                        description: 'First section.',
                        chapterNumber: 1,
                        sectionCode: 'A',
                        sectionKey: '1-a',
                        headerCaption: 'First header caption',
                    },
                ],
            },
        })

        await expect(getTextbookSections()).resolves.toMatchObject([
            {
                sys: { id: 'section-1a' },
                title: 'Level 1A',
                sectionKey: '1-a',
                headerCaption: 'First header caption',
            },
            {
                sys: { id: 'section-1b' },
                title: 'Level 1B',
                sectionKey: '1-b',
                headerCaption: 'Second header caption',
            },
        ])

        expect(mockedGraphQLFetch).toHaveBeenCalledWith({
            query: expect.stringContaining('textbookSectionCollection(limit: $limit, locale: $locale, preview: false)'),
            variables: { limit: 100, locale: undefined },
            preview: false,
        })
        expect(mockedGraphQLFetch).toHaveBeenCalledWith(
            expect.objectContaining({
                query: expect.stringContaining('headerCaption'),
            }),
        )
    })
})
