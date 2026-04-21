import { getContentfulEntryByField } from './queries'

type ExerciseLink = {
    sys: {
        id: string
    }
    title: string
    chapterNumber: number
    sectionCode: string
    sectionKey: string
}

type HeaderVisual = {
    sys: {
        id: string
    }
    url: string
    title?: string
    description?: string
    width?: number
    height?: number
}

export type TextbookSectionEntry = {
    title: string
    description: string
    chapterNumber: number
    sectionCode: string
    sectionKey: string
    headerCaption?: string
    practiceLinks?: string
    headerVisual?: HeaderVisual | null
    exercises?: ExerciseLink | null
}

export const getTextbookSectionBySectionKey = async (sectionKey: string) => {
    return getContentfulEntryByField<TextbookSectionEntry>({
        collectionName: 'textbookSection',
        fieldName: 'sectionKey',
        value: sectionKey,
        fields: `
            title
            headerVisual {
                sys {
                    id
                }
                url
                title
                description
                width
                height
            }
            headerCaption
            description
            practiceLinks
            chapterNumber
            sectionCode
            sectionKey
            exercises {
                sys {
                    id
                }
                title
                chapterNumber
                sectionCode
                sectionKey
            }
        `,
    })
}
