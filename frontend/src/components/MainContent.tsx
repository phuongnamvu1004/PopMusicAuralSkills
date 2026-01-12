import { ExampleBox } from './ExampleBox';
import { PlayButton } from './PlayButton';

export function MainContent() {
  return (
    <main className="flex-1 p-12 overflow-auto">
      <div className="max-w-3xl">
        <h1 className="mb-6">Chapter 1: Melodic Intervals</h1>

        <p className="mb-4 text-gray-700">
          A melodic interval is the distance between two notes played in sequence, one 
          after the other. The two most important qualities to identify are the <strong>distance</strong> (e.g., 
          2nd, 3rd, 4th) and the <strong>quality</strong> (e.g., major, minor, perfect).
        </p>

        <p className="mb-6 text-gray-700">
          For example, the distance from C to D is a 2nd. The distance from C to E is a 3rd. 
          We will learn to identify these by sound alone.
        </p>

        <ExampleBox title="In-Text Example: Major 3rd">
          <p className="mb-4 text-gray-700">
            Listen to the example below. This is a <strong>Major 3rd</strong> (like the first two notes of 
            "When the Saints Go Marching In").
          </p>

          <PlayButton label="Play Major 3rd (C4 - E4)" />
        </ExampleBox>

        <p className="mb-4 text-gray-700">
          Recognizing intervals often involves associating them with the beginning of 
          familiar songs. This "song association" method is a very effective tool.
        </p>

        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">
            <strong>Minor 2nd:</strong> "Jaws" theme
          </li>
          <li className="text-gray-700">
            <strong>Major 2nd:</strong> "Happy Birthday" (first two notes)
          </li>
          <li className="text-gray-700">
            <strong>Minor 3rd:</strong> "Greensleeves" (first two notes)
          </li>
          <li className="text-gray-700">
            <strong>Major 3rd:</strong> "When the Saints..." (first two notes)
          </li>
          <li className="text-gray-700">
            <strong>Perfect 4th:</strong> "Here Comes the Bride" (first two notes)
          </li>
        </ul>

        <p className="text-gray-700">
          When you feel ready, proceed to the exercise section to practice identifying 
          melodic intervals.
        </p>
      </div>
    </main>
  );
}
