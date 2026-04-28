import { useEffect, useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import {
  getExerciseById,
  type ExerciseEntry,
  type ExerciseKeyEntry,
} from '../../lib/contentful/exercises';

type ExerciseLine = {
  lineId: string;
  blanks: string[];
  lyric: string;
};

type BlankBox = {
  width: number;
  height: number;
  gap: number;
};

type Answers = Record<string, string>;
type Results = Record<string, 'correct' | 'wrong' | 'empty'>;

type ExerciseHeaderProps = {
  exercise: ExerciseEntry;
};

type ExerciseLinesProps = {
  lines: ExerciseLine[];
  answers: Answers;
  results: Results;
  onChange: (id: string, value: string) => void;
  blankBox: BlankBox;
};

type ExerciseLineRowProps = {
  line: ExerciseLine;
  answers: Answers;
  results: Results;
  onChange: (id: string, value: string) => void;
  blankBox: BlankBox;
};

type BlankRowProps = {
  blankIds: string[];
  answers: Answers;
  results: Results;
  onChange: (id: string, value: string) => void;
  blankBox: BlankBox;
};

type BlankCellProps = {
  id: string;
  value: string;
  status?: Results[string];
  onChange: (value: string) => void;
  size: BlankBox;
};

type LyricRowProps = {
  lyric: string;
  blankCount: number;
  blankBox: BlankBox;
};

type ExercisePageProps = {
  exerciseId: string;
  missingTitle: string;
  missingMessage?: string;
};

const defaultBlankBox: BlankBox = { width: 64, height: 30, gap: 10 };

const isExerciseLine = (value: unknown): value is ExerciseLine => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const line = value as ExerciseLine;
  return (
    typeof line.lineId === 'string' &&
    Array.isArray(line.blanks) &&
    line.blanks.every((blank) => typeof blank === 'string') &&
    typeof line.lyric === 'string'
  );
};

const getExerciseLines = (exercise: ExerciseEntry): ExerciseLine[] =>
  exercise.lines?.filter(isExerciseLine) ?? [];

const getBlankBox = (exercise: ExerciseEntry): BlankBox => ({
  width: exercise.blankBox?.width ?? defaultBlankBox.width,
  height: exercise.blankBox?.height ?? defaultBlankBox.height,
  gap: exercise.blankBox?.gap ?? defaultBlankBox.gap,
});

function ComingSoonCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="max-w-prose">
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mb-3">{title}</h3>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6 h-10 w-80 animate-pulse rounded-lg bg-gray-200" />
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-6 h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="space-y-5">
          <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-8 w-11/12 animate-pulse rounded bg-gray-100" />
          <div className="h-8 w-10/12 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-4xl">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-red-800">Unable to load exercise</h2>
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
}

function ExerciseHeader({ exercise }: ExerciseHeaderProps) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-sky-700">
        Chapter {exercise.chapterNumber} · Section {exercise.sectionCode}
      </p>
      <h1 className="mb-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-950">
        {exercise.title}
      </h1>
      {exercise.meta && (
        <div className="space-y-1 text-sm text-gray-600">
          <div>
            <span className="font-semibold text-gray-700">Level:</span> {exercise.meta.level}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Key:</span> {exercise.meta.key}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Cue:</span> {exercise.meta.cue}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Source:</span>{' '}
            <a
              href={exercise.meta.source}
              target="_blank"
              rel="noreferrer"
              className="text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-800"
            >
              {exercise.meta.source}
            </a>
          </div>
        </div>
      )}
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
          className="text-center text-sm tracking-wide text-gray-700"
          style={{ width: `${blankBox.width}px` }}
        >
          {token}
        </div>
      ))}
    </div>
  );
}

function ExerciseWorksheet({ exercise }: { exercise: ExerciseEntry }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Results>({});
  const lines = useMemo(() => getExerciseLines(exercise), [exercise]);
  const blankBox = useMemo(() => getBlankBox(exercise), [exercise]);
  const answerKey = exercise.exerciseKey;

  useEffect(() => {
    setAnswers({});
    setResults({});
  }, [exercise.id]);

  const normalizedAnswerKey = useMemo(() => {
    const grading: ExerciseKeyEntry['grading'] = answerKey?.grading ?? {
      trim: true,
      caseInsensitive: true,
      allowedValues: [],
    };

    const normalize = (value: string) => {
      let nextValue = value;
      if (grading.trim) {
        nextValue = nextValue.trim();
      }
      if (grading.caseInsensitive) {
        nextValue = nextValue.toLowerCase();
      }
      return nextValue;
    };

    const normalized: Record<string, string> = {};
    Object.entries(answerKey?.answersById ?? {}).forEach(([id, value]) => {
      normalized[id] = normalize(value);
    });

    return { normalize, answersById: normalized };
  }, [answerKey]);

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

    lines.forEach((line) => {
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

  const allowedValues = answerKey?.grading.allowedValues?.join(', ');
  const canCheckAnswers = !!answerKey && !!Object.keys(answerKey.answersById).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="mb-1">Worksheet</h3>
          <p className="text-sm text-gray-500">
            Fill in each blank{allowedValues ? ` using ${allowedValues}` : ''}, then check your
            answers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCheck}
            disabled={!canCheckAnswers}
            className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
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

      {!canCheckAnswers && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          This exercise does not have an answer key attached yet.
        </div>
      )}

      {summary && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          Correct: {summary.correct} / {summary.total}
        </div>
      )}

      {lines.length ? (
        <ExerciseLines
          lines={lines}
          answers={answers}
          results={results}
          onChange={handleChange}
          blankBox={blankBox}
        />
      ) : (
        <p className="text-sm text-gray-500">This exercise does not have worksheet lines yet.</p>
      )}
    </div>
  );
}

function ExerciseContent({ exercise }: { exercise: ExerciseEntry }) {
  return (
    <div className="max-w-4xl">
      <ExerciseHeader exercise={exercise} />
      <ExerciseWorksheet exercise={exercise} />
    </div>
  );
}

export function ExercisePage({
  exerciseId,
  missingTitle,
  missingMessage = 'This exercise section is currently being developed. Check back soon for new practice content!',
}: ExercisePageProps) {
  const [exercise, setExercise] = useState<ExerciseEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadExercise = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextExercise = await getExerciseById(exerciseId);

        if (cancelled) return;

        setExercise(nextExercise);
      } catch (nextError) {
        if (cancelled) return;

        setExercise(null);
        setError(nextError instanceof Error ? nextError.message : 'Failed to load exercise.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadExercise();

    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!exercise) {
    return <ComingSoonCard title={missingTitle} message={missingMessage} />;
  }

  return <ExerciseContent exercise={exercise} />;
}
