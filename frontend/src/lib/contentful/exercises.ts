import { getContentfulCollection, getContentfulEntryByField } from './queries'

export type ExerciseMetaEntry = {
    exerciseId: string
    source: string
    level: string
    key: string
    cue: string
}

export type ExerciseKeyEntry = {
    exerciseId: string
    answersByLine: Record<string, string[]>
    answersById: Record<string, string>
    grading: {
        trim: boolean
        caseInsensitive: boolean
        allowedValues: string[]
    }
}

export type ExerciseEntry = {
    id: string
    title: string
    chapterNumber: number
    sectionCode: string
    sectionKey: string
    lines?: Array<{
        lineId: string
        blanks: string[]
        lyric: string
    }>
    renderStyle?: string
    blankBox?: {
        width: number
        height: number
        gap: number
    }
    meta?: ExerciseMetaEntry | null
    exerciseKey?: ExerciseKeyEntry | null
}

export const getAllExercises = async () => {
    return getContentfulCollection<ExerciseEntry>({
        collectionName: 'exercises',
        fields: `
            id
            title
            chapterNumber
            sectionCode
            sectionKey
        `,
        limit: 100,
    })
}

export const getExerciseBySectionKey = async (sectionKey: string) => {
    return getContentfulEntryByField<ExerciseEntry>({
        collectionName: 'exercises',
        fieldName: 'sectionKey',
        value: sectionKey,
        fields: `
            id
            title
            chapterNumber
            sectionCode
            sectionKey
            lines
            renderStyle
            blankBox
            meta {
                exerciseId
                source
                level
                key
                cue
            }
            exerciseKey {
                exerciseId
                answersByLine
                answersById
                grading
            }
        `,
    })
}
