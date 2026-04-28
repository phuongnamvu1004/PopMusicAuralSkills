import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Introduction } from './components/content/Introduction';
import { ExercisePage } from './components/content/ExercisePage';
import { TextbookSectionPage } from './components/content/TextbookSectionPage';
import {
  getTextbookSections,
  type TextbookSectionEntry,
} from './lib/contentful/textbook-sections';
import { getAllExercises, type ExerciseEntry } from './lib/contentful/exercises';

export type ContentType =
  | 'intro'
  | `textbook:${string}`
  | `exercise:${string}`;

const getTextbookContentId = (sectionKey: string): ContentType => `textbook:${sectionKey}`;
const getExerciseContentId = (exerciseId: string): ContentType => `exercise:${exerciseId}`;

const getTextbookSectionKey = (content: ContentType) => {
  if (!content.startsWith('textbook:')) {
    return null;
  }

  return content.replace('textbook:', '');
};

const getExerciseId = (content: ContentType) => {
  if (!content.startsWith('exercise:')) {
    return null;
  }

  return content.replace('exercise:', '');
};

export default function App() {
  const [activeContent, setActiveContent] = useState<ContentType>('intro');
  const [textbookSections, setTextbookSections] = useState<TextbookSectionEntry[]>([]);
  const [isLoadingTextbookSections, setIsLoadingTextbookSections] = useState(true);
  const [textbookSectionsError, setTextbookSectionsError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [exercisesError, setExercisesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadTextbookSections = async () => {
      setIsLoadingTextbookSections(true);
      setTextbookSectionsError(null);

      try {
        const nextSections = await getTextbookSections();

        if (!cancelled) {
          setTextbookSections(nextSections);
        }
      } catch (error) {
        if (!cancelled) {
          setTextbookSections([]);
          setTextbookSectionsError(
            error instanceof Error ? error.message : 'Failed to load textbook sections.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTextbookSections(false);
        }
      }
    };

    void loadTextbookSections();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadExercises = async () => {
      setIsLoadingExercises(true);
      setExercisesError(null);

      try {
        const nextExercises = await getAllExercises();

        if (!cancelled) {
          setExercises(nextExercises);
        }
      } catch (error) {
        if (!cancelled) {
          setExercises([]);
          setExercisesError(error instanceof Error ? error.message : 'Failed to load exercises.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingExercises(false);
        }
      }
    };

    void loadExercises();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderContent = () => {
    const textbookSectionKey = getTextbookSectionKey(activeContent);
    const exerciseId = getExerciseId(activeContent);

    if (textbookSectionKey) {
      const selectedSection = textbookSections.find(
        (section) => section.sectionKey === textbookSectionKey,
      );

      return (
        <TextbookSectionPage
          sectionKey={textbookSectionKey}
          missingTitle={selectedSection?.title ?? 'Textbook section'}
        />
      );
    }

    if (exerciseId) {
      const selectedExercise = exercises.find(
        (exercise) => exercise.id === exerciseId,
      );

      return (
        <ExercisePage
          exerciseId={exerciseId}
          missingTitle={selectedExercise?.title ?? 'Exercise section'}
        />
      );
    }

    switch (activeContent) {
      case 'intro':
        return <Introduction />;
      default:
        return <Introduction />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeContent={activeContent}
        setActiveContent={setActiveContent}
        textbookSections={textbookSections}
        isLoadingTextbookSections={isLoadingTextbookSections}
        textbookSectionsError={textbookSectionsError}
        getTextbookContentId={getTextbookContentId}
        exercises={exercises}
        isLoadingExercises={isLoadingExercises}
        exercisesError={exercisesError}
        getExerciseContentId={getExerciseContentId}
      />
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
