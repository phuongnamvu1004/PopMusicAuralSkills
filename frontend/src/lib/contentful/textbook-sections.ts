import { getContentfulCollection, getContentfulEntryByField } from './queries'

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
    sys: {
        id: string
    }
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

const textbookSectionFields = `
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
`

export const getTextbookSections = async () => {
    const sections = await getContentfulCollection<TextbookSectionEntry>({
        collectionName: 'textbookSection',
        fields: textbookSectionFields,
        limit: 100,
    })

    return sections.sort((first, second) => {
        if (first.chapterNumber !== second.chapterNumber) {
            return first.chapterNumber - second.chapterNumber
        }

        return first.sectionCode.localeCompare(second.sectionCode, undefined, {
            numeric: true,
            sensitivity: 'base',
        })
    })
}

export const getTextbookSectionBySectionKey = async (sectionKey: string) => {
    return getContentfulEntryByField<TextbookSectionEntry>({
        collectionName: 'textbookSection',
        fieldName: 'sectionKey',
        value: sectionKey,
        fields: textbookSectionFields,
    })
}
