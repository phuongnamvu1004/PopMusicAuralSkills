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
    sys: {
        id: string
    }
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

const sortExercises = (exercises: ExerciseEntry[]) =>
    exercises.sort((first, second) => {
        if (first.chapterNumber !== second.chapterNumber) {
            return first.chapterNumber - second.chapterNumber
        }

        const sectionComparison = first.sectionCode.localeCompare(second.sectionCode, undefined, {
            numeric: true,
            sensitivity: 'base',
        })

        if (sectionComparison !== 0) {
            return sectionComparison
        }

        return first.title.localeCompare(second.title, undefined, {
            numeric: true,
            sensitivity: 'base',
        })
    })

export const getAllExercises = async () => {
    const exercises = await getContentfulCollection<ExerciseEntry>({
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

    return sortExercises(exercises)
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

export const getExerciseById = async (id: string) => {
    return getContentfulEntryByField<ExerciseEntry>({
        collectionName: 'exercises',
        fieldName: 'id',
        value: id,
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
