import { useMemo, useState } from 'react';
import exerciseData from '../data/exercises/exercise-ex001.json';
import answerKeyData from '../data/exercises/answerKey-ex001.json';

type ExerciseLine = {
  lineId: string;
  blanks: string[];
  lyric: string;
};

type ExerciseData = {
  id: string;
  title: string;
  meta: {
    source: string;
    level: string;
    key: string;
    cue: string;
  };
  lines: ExerciseLine[];
  ui: {
    renderStyle: 'underscores' | string;
    blankBox: {
      width: number;
      height: number;
      gap: number;
    };
  };
};

type AnswerKey = {
  exerciseId: string;
  answersById: Record<string, string>;
  grading: {
    trim: boolean;
    caseInsensitive: boolean;
    allowedValues: string[];
  };
};

type Answers = Record<string, string>;
type Results = Record<string, 'correct' | 'wrong' | 'empty'>;

type ExerciseHeaderProps = {
  title: string;
  meta: ExerciseData['meta'];
};

type ExerciseLinesProps = {
  lines: ExerciseLine[];
  answers: Answers;
  results: Results;
  onChange: (id: string, value: string) => void;
  blankBox: ExerciseData['ui']['blankBox'];
};

type ExerciseLineRowProps = {
  line: ExerciseLine;
  answers: Answers;
  results: Results;
  onChange: (id: string, value: string) => void;
  blankBox: ExerciseData['ui']['blankBox'];
};

type BlankRowProps = {
  blankIds: string[];
  answers: Answers;
  results: Results;
  onChange: (id: string, value: string) => void;
  blankBox: ExerciseData['ui']['blankBox'];
};

type BlankCellProps = {
  id: string;
  value: string;
  status?: Results[string];
  onChange: (value: string) => void;
  size: ExerciseData['ui']['blankBox'];
};

type LyricRowProps = {
  lyric: string;
  blankCount: number;
  blankBox: ExerciseData['ui']['blankBox'];
};

const exercise = exerciseData as ExerciseData;
const answerKey = answerKeyData as AnswerKey;

function ExerciseHeader({ title, meta }: ExerciseHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-2">{title}</h2>
      <div className="text-sm text-gray-600 space-y-1">
        <div>
          <span className="font-semibold text-gray-700">Level:</span> {meta.level}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Key:</span> {meta.key}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Cue:</span> {meta.cue}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Source:</span> {meta.source}
        </div>
      </div>
    </div>
  );
}

function ExerciseLines({ lines, answers, results, onChange, blankBox }: ExerciseLinesProps) {
  return (
    <div className="space-y-6">
      {lines.map((line) => (
        <ExerciseLineRow
          key={line.lineId}
          line={line}
          answers={answers}
          results={results}
          onChange={onChange}
          blankBox={blankBox}
        />
      ))}
    </div>
  );
}

function ExerciseLineRow({ line, answers, results, onChange, blankBox }: ExerciseLineRowProps) {
  return (
    <div className="space-y-2">
      <BlankRow
        blankIds={line.blanks}
        answers={answers}
        results={results}
        onChange={onChange}
        blankBox={blankBox}
      />
      <LyricRow lyric={line.lyric} blankCount={line.blanks.length} blankBox={blankBox} />
    </div>
  );
}

function BlankRow({ blankIds, answers, results, onChange, blankBox }: BlankRowProps) {
  return (
    <div
      className="flex flex-wrap"
      style={{
        columnGap: `${blankBox.gap}px`,
        rowGap: `${blankBox.gap}px`,
      }}
    >
      {blankIds.map((id) => (
        <BlankCell
          key={id}
          id={id}
          value={answers[id] ?? ''}
          status={results[id]}
          onChange={(value) => onChange(id, value)}
          size={blankBox}
        />
      ))}
    </div>
  );
}

function BlankCell({ id, value, status, onChange, size }: BlankCellProps) {
  const baseClasses =
    'bg-transparent text-center font-semibold text-gray-800 focus:outline-none border-b-2 transition-colors';
  const statusClasses =
    status === 'correct'
      ? 'border-green-500 text-green-700'
      : status === 'wrong'
        ? 'border-red-500 text-red-600'
        : status === 'empty'
          ? 'border-amber-400 text-gray-600'
          : 'border-gray-400';

  return (
    <input
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputMode="numeric"
      maxLength={1}
      className={`${baseClasses} ${statusClasses}`}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      aria-label={`Blank ${id}`}
    />
  );
}

function LyricRow({ lyric, blankCount, blankBox }: LyricRowProps) {
  const rawTokens = lyric.split(' ').filter(Boolean);
  let tokens = rawTokens;

  if (rawTokens.length > blankCount) {
    tokens = [...rawTokens.slice(0, blankCount - 1), rawTokens.slice(blankCount - 1).join(' ')];
  } else if (rawTokens.length < blankCount) {
    tokens = [...rawTokens, ...Array.from({ length: blankCount - rawTokens.length }, () => '')];
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${blankCount}, ${blankBox.width}px)`,
        columnGap: `${blankBox.gap}px`,
        rowGap: `${blankBox.gap}px`,
      }}
    >
      {tokens.map((token, index) => (
        <div
          key={`${token}-${index}`}
          className="text-center text-sm text-gray-700 tracking-wide"
          style={{ width: `${blankBox.width}px` }}
        >
          {token}
        </div>
      ))}
    </div>
  );
}

function ExercisePage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Results>({});

  const normalizedAnswerKey = useMemo(() => {
    const normalize = (value: string) => {
      let nextValue = value;
      if (answerKey.grading.trim) {
        nextValue = nextValue.trim();
      }
      if (answerKey.grading.caseInsensitive) {
        nextValue = nextValue.toLowerCase();
      }
      return nextValue;
    };

    const normalized: Record<string, string> = {};
    Object.entries(answerKey.answersById).forEach(([id, value]) => {
      normalized[id] = normalize(value);
    });

    return { normalize, answersById: normalized };
  }, []);

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (results[id]) {
      setResults((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleCheck = () => {
    const nextResults: Results = {};

    exercise.lines.forEach((line) => {
      line.blanks.forEach((id) => {
        const raw = answers[id] ?? '';
        const normalized = normalizedAnswerKey.normalize(raw);
        if (!normalized) {
          nextResults[id] = 'empty';
          return;
        }

        const expected = normalizedAnswerKey.answersById[id];
        nextResults[id] = normalized === expected ? 'correct' : 'wrong';
      });
    });

    setResults(nextResults);
  };

  const handleClear = () => {
    setAnswers({});
    setResults({});
  };

  const summary = useMemo(() => {
    const values = Object.values(results);
    if (!values.length) return null;
    const correct = values.filter((value) => value === 'correct').length;
    const total = values.length;
    return { correct, total };
  }, [results]);

  return (
    <div className="max-w-4xl">
      <ExerciseHeader title={exercise.title} meta={exercise.meta} />

      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="mb-1">Worksheet</h3>
            <p className="text-sm text-gray-500">
              Fill in scale degrees 1–3 for each blank, then check your answers.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCheck}
              className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700 transition hover:bg-sky-100"
            >
              Check Answers
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        {summary && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Correct: {summary.correct} / {summary.total}
          </div>
        )}

        <ExerciseLines
          lines={exercise.lines}
          answers={answers}
          results={results}
          onChange={handleChange}
          blankBox={exercise.ui.blankBox}
        />
      </div>
    </div>
  );
}

export function Chapter1Exercise() {
  return <ExercisePage />;
}
