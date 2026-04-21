import { getContentfulEntryByField } from './queries'
import type { ExerciseMetaEntry } from './exercises'

export const getExerciseMetaByExerciseId = async (exerciseId: string) => {
    return getContentfulEntryByField<ExerciseMetaEntry>({
        collectionName: 'exerciseMeta',
        fieldName: 'exerciseId',
        value: exerciseId,
        fields: `
            exerciseId
            source
            level
            key
            cue
        `,
    })
}
