import React, { useState, useEffect } from 'react';
import { AudioButton } from '../AudioButton';
import { audio } from '../../lib/audio';
import { Trophy, Target, RotateCcw } from 'lucide-react';

interface ScaleDegree {
  degree: number;
  note: string;
  label: string;
}

const scaleDigrees: ScaleDegree[] = [
  { degree: 1, note: "C4", label: "Scale Degree 1" },
  { degree: 2, note: "D4", label: "Scale Degree 2" },
  { degree: 3, note: "E4", label: "Scale Degree 3" },
];

export function Chapter1Exercise() {
  const [currentDegree, setCurrentDegree] = useState<ScaleDegree | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null, message: string }>({ type: null, message: '' });
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showReference, setShowReference] = useState(true);

  const setupNewQuestion = React.useCallback(() => {
    setFeedback({ type: null, message: '' });
    setHasPlayed(false);
    
    const randomIndex = Math.floor(Math.random() * scaleDigrees.length);
    const randomDegree = scaleDigrees[randomIndex];
    setCurrentDegree(randomDegree);
  }, [scaleDigrees]);

  const playCurrentDegree = () => {
    if (currentDegree) {
      // Play tonic first for reference, then the target note
      audio.playNote('C4', 0.5, 0);
      audio.playNote(currentDegree.note, 0.8, 0.6);
      setHasPlayed(true);
    }
  };

  const playReference = () => {
    // Play all three scale degrees in order
    audio.playNote('C4', 0.5, 0);
    audio.playNote('D4', 0.5, 0.6);
    audio.playNote('E4', 0.6, 1.2);
  };

  const checkAnswer = (selectedDegree: number) => {
    if (!currentDegree || feedback.type) return;
    
    const isCorrect = selectedDegree === currentDegree.degree;
    setScore(prev => ({ 
      correct: prev.correct + (isCorrect ? 1 : 0), 
      total: prev.total + 1 
    }));
    
    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'Correct! Well done!' });
      setTimeout(setupNewQuestion, 1500);
    } else {
      setFeedback({ type: 'incorrect', message: `Incorrect. The answer was Scale Degree ${currentDegree.degree}.` });
      setTimeout(setupNewQuestion, 2500);
    }
  };

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setupNewQuestion();
  };

  useEffect(() => {
    setupNewQuestion();
  }, []);

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="max-w-4xl">
      <h2 className="mb-4">Level 1A: Exercises</h2>
      <p className="text-gray-600 mb-8">
        Listen carefully and identify which scale degree you hear.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Score</div>
            <div className="text-green-600">{score.correct} / {score.total}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Accuracy</div>
            <div className="text-blue-600">{accuracy}%</div>
          </div>
        </div>

        <button 
          onClick={resetScore}
          className="bg-white rounded-lg p-4 shadow-md border border-gray-200 flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-left">
            <div className="text-xs text-gray-500">Reset</div>
            <div className="text-gray-700 text-sm">Start Over</div>
          </div>
        </button>
      </div>

      {/* Reference Toggle */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4>Reference Tool</h4>
          <button
            onClick={() => setShowReference(!showReference)}
            className="text-sm text-amber-700 hover:text-amber-800 underline"
          >
            {showReference ? 'Hide' : 'Show'}
          </button>
        </div>
        {showReference && (
          <>
            <p className="text-gray-700 text-sm mb-4">
              Need help? Play this reference to hear all three scale degrees in order (1-2-3).
            </p>
            <AudioButton 
              label="Play Reference (1-2-3)" 
              onPlay={playReference}
              variant="secondary"
            />
          </>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200 max-w-2xl mx-auto">
        <h3 className="text-center mb-6">Scale Degree Identification</h3>
        
        <div className="text-center mb-8">
          <div className="bg-gray-50 rounded-lg p-4 mb-4 inline-block">
            <p className="text-sm text-gray-600 mb-2">You will hear:</p>
            <p className="text-gray-800">Scale Degree 1 (reference) → Target Note</p>
          </div>
          <div>
            <AudioButton 
              label={hasPlayed ? "Play Again" : "Play Scale Degree"}
              onPlay={playCurrentDegree}
            />
            {!hasPlayed && (
              <p className="text-sm text-gray-500 mt-2">Click to hear the scale degree</p>
            )}
          </div>
        </div>

        <div className="mb-4 text-center text-sm text-gray-600">
          Which scale degree did you hear?
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {scaleDigrees.map((scaleDegree) => (
            <button
              key={scaleDegree.degree}
              onClick={() => checkAnswer(scaleDegree.degree)}
              disabled={!!feedback.type}
              className={`px-4 py-6 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed
                ${feedback.type && scaleDegree.degree === currentDegree?.degree
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : feedback.type === 'incorrect' && scaleDegree.degree !== currentDegree?.degree
                  ? 'bg-gray-50 border-gray-200 text-gray-400'
                  : 'bg-white border-gray-300 hover:border-sky-500 hover:bg-sky-50'
                }`}
            >
              <div className={`text-3xl mb-2 ${
                feedback.type && scaleDegree.degree === currentDegree?.degree
                  ? 'text-green-600'
                  : 'text-gray-700'
              }`}>
                {scaleDegree.degree}
              </div>
              <div className="text-xs text-gray-600">
                {scaleDegree.degree === 1 && 'Do'}
                {scaleDegree.degree === 2 && 'Re'}
                {scaleDegree.degree === 3 && 'Mi'}
              </div>
            </button>
          ))}
        </div>

        <div className="h-16 flex items-center justify-center">
          {feedback.type === 'correct' && (
            <div className="text-green-600 animate-fadeIn text-center">
              <div className="text-2xl mb-1">✓</div>
              <div>{feedback.message}</div>
            </div>
          )}
          {feedback.type === 'incorrect' && (
            <div className="text-red-600 animate-fadeIn text-center">
              <div className="text-2xl mb-1">✗</div>
              <div>{feedback.message}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mt-8 max-w-2xl mx-auto">
        <h4 className="mb-3">Practice Tips</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Scale degree 1 (Do) is the "home" note - it sounds stable and resolved.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Scale degree 2 (Re) is one step up - it creates tension and wants to move.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Scale degree 3 (Mi) is two steps up - it sounds bright and defines the major quality.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Try singing the scale degree back before answering!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
