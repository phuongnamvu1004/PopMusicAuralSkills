import { getContentfulEntryByField } from './queries'
import type { ExerciseKeyEntry } from './exercises'

export const getExerciseKeyByExerciseId = async (exerciseId: string) => {
    return getContentfulEntryByField<ExerciseKeyEntry>({
        collectionName: 'exerciseKey',
        fieldName: 'exerciseId',
        value: exerciseId,
        fields: `
            exerciseId
            answersByLine
            answersById
            grading
        `,
    })
}
