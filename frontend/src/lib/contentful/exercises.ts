import { getContentfulCollection } from './queries'

export type ExerciseEntry = {
    title: string
    chapterNumber: number
    sectionCode: string
    sectionKey: string
}

export const getAllExercises = async () => {
    return getContentfulCollection<ExerciseEntry>({
        collectionName: 'exercises',
        fields: `
            title
            chapterNumber
            sectionCode
            sectionKey
        `,
        limit: 100,
    })
}
