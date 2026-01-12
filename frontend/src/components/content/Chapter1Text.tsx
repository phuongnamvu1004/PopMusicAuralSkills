import { ExampleBox } from '../ExampleBox';
import { AudioButton } from '../AudioButton';
import { audio } from '../../lib/audio';

export function Chapter1Text() {
  return (
    <div className="max-w-4xl">
      <h2 className="mb-6">Level 1A: Scale Degrees 1, 2, 3</h2>
      
      <div className="max-w-prose space-y-4">
        <p className="text-gray-700">
          In music, every note in a scale has a <strong>scale degree</strong> number that tells us its position. 
          The first note of the scale is called <strong>scale degree 1</strong> (the tonic or "home" note), 
          the second note is <strong>scale degree 2</strong>, and the third note is <strong>scale degree 3</strong>.
        </p>
        
        <p className="text-gray-700">
          Understanding scale degrees helps us recognize melodies by their pattern of movement, rather than 
          by absolute pitches. In this level, we'll focus on the first three scale degrees.
        </p>
        
        <ExampleBox title="In-Text Example: Scale Degrees 1-2-3">
          <p className="mb-4 text-gray-700">
            Listen to the ascending pattern of scale degrees 1, 2, and 3. Notice how each step creates 
            a sense of upward motion, like climbing stairs.
          </p>
          <div className="flex flex-wrap gap-4">
            <AudioButton 
              label="Play Scale Degree 1 (C)" 
              onPlay={() => audio.playNote('C4', 0.8)}
            />
            <AudioButton 
              label="Play Scale Degree 2 (D)" 
              onPlay={() => audio.playNote('D4', 0.8)}
            />
            <AudioButton 
              label="Play Scale Degree 3 (E)" 
              onPlay={() => audio.playNote('E4', 0.8)}
            />
          </div>
          <div className="mt-4">
            <AudioButton 
              label="Play All Three (1-2-3)" 
              onPlay={() => {
                audio.playNote('C4', 0.6, 0);
                audio.playNote('D4', 0.6, 0.7);
                audio.playNote('E4', 0.6, 1.4);
              }}
              variant="primary"
            />
          </div>
        </ExampleBox>

        <p className="text-gray-700">
          Each scale degree has a unique relationship to the tonic (scale degree 1). Learning to hear 
          these relationships is the foundation of ear training.
        </p>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 my-6">
          <h3 className="mb-4">Understanding Scale Degrees 1, 2, 3</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs shrink-0">1</span>
              <div>
                <strong className="text-gray-900">Scale Degree 1 (Tonic):</strong>
                <span className="text-gray-600"> The "home" note. It feels stable and restful, like you've arrived at your destination.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs shrink-0">2</span>
              <div>
                <strong className="text-gray-900">Scale Degree 2:</strong>
                <span className="text-gray-600"> One step up from home. Creates movement and often wants to resolve back to 1 or continue to 3.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs shrink-0">3</span>
              <div>
                <strong className="text-gray-900">Scale Degree 3:</strong>
                <span className="text-gray-600"> The character note that determines if the scale sounds major (bright) or minor (dark).</span>
              </div>
            </div>
          </div>
        </div>

        <ExampleBox title="Common Melodic Patterns">
          <p className="mb-4 text-gray-700">
            Listen to these simple melodic patterns using only scale degrees 1, 2, and 3. 
            Try to sing them back after listening!
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <AudioButton 
                label="Pattern: 1-2-3-2-1" 
                onPlay={() => {
                  audio.playNote('C4', 0.4, 0);
                  audio.playNote('D4', 0.4, 0.5);
                  audio.playNote('E4', 0.4, 1.0);
                  audio.playNote('D4', 0.4, 1.5);
                  audio.playNote('C4', 0.6, 2.0);
                }}
              />
              <span className="text-gray-600 text-sm">(Up and back down)</span>
            </div>
            <div className="flex items-center gap-3">
              <AudioButton 
                label="Pattern: 1-3-2-1" 
                onPlay={() => {
                  audio.playNote('C4', 0.4, 0);
                  audio.playNote('E4', 0.4, 0.5);
                  audio.playNote('D4', 0.4, 1.0);
                  audio.playNote('C4', 0.6, 1.5);
                }}
              />
              <span className="text-gray-600 text-sm">(Skip up, step down)</span>
            </div>
            <div className="flex items-center gap-3">
              <AudioButton 
                label="Pattern: 3-2-1" 
                onPlay={() => {
                  audio.playNote('E4', 0.4, 0);
                  audio.playNote('D4', 0.4, 0.5);
                  audio.playNote('C4', 0.6, 1.0);
                }}
              />
              <span className="text-gray-600 text-sm">(Descending to home)</span>
            </div>
          </div>
        </ExampleBox>

        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200 mt-6">
          <h4 className="mb-2">Pro Tip</h4>
          <p className="text-gray-700 text-sm">
            When listening to melodies, try to identify when the music returns to scale degree 1. 
            This "home" note acts as an anchor that helps you hear all the other scale degrees in relation to it.
          </p>
        </div>

        <p className="text-gray-700">
          When you feel ready, proceed to the exercise section to practice identifying scale degrees 1, 2, and 3 by ear.
        </p>
      </div>
    </div>
  );
}
