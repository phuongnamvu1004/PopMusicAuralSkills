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

export type TextbookSectionEntry = {
    title: string
    description: string
    chapterNumber: number
    sectionCode: string
    sectionKey: string
    headerCaption?: string
    practiceLinks?: string
    exercises?: ExerciseLink | null
}

export const getTextbookSectionBySectionKey = async (sectionKey: string) => {
    return getContentfulEntryByField<TextbookSectionEntry>({
        collectionName: 'textbookSection',
        fieldName: 'sectionKey',
        value: sectionKey,
        fields: `
            title
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
