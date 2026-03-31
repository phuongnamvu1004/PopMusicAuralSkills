import { getAllExercises } from './exercises'

export const runExercisesFetchTest = async () => {
    try {
        const exercises = await getAllExercises()

        console.group('Contentful Exercises fetch test')
        console.log('Total entries:', exercises.length)
        console.table(
            exercises.map((exercise) => ({
                id: exercise.sys.id,
                title: exercise.title,
                chapterNumber: exercise.chapterNumber,
                sectionCode: exercise.sectionCode,
                sectionKey: exercise.sectionKey,
            })),
        )
        console.log('Raw payload:', exercises)
        console.groupEnd()
    } catch (error) {
        console.error('Contentful Exercises fetch test failed:', error)
    }
}
