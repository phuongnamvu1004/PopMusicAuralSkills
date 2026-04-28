import { useMemo, useState } from 'react';
import type { ContentType } from '../App';
import type { ExerciseEntry } from '../lib/contentful/exercises';
import type { TextbookSectionEntry } from '../lib/contentful/textbook-sections';
import { SidebarSection } from './SidebarSection';
import { SidebarLink } from './SidebarLink';

interface SidebarProps {
  activeContent: ContentType;
  setActiveContent: (content: ContentType) => void;
  textbookSections: TextbookSectionEntry[];
  isLoadingTextbookSections: boolean;
  textbookSectionsError: string | null;
  getTextbookContentId: (sectionKey: string) => ContentType;
  exercises: ExerciseEntry[];
  isLoadingExercises: boolean;
  exercisesError: string | null;
  getExerciseContentId: (exerciseId: string) => ContentType;
}

const groupTextbookSectionsByChapter = (sections: TextbookSectionEntry[]) =>
  sections.reduce<Record<number, TextbookSectionEntry[]>>((groups, section) => {
    groups[section.chapterNumber] = groups[section.chapterNumber] ?? [];
    groups[section.chapterNumber].push(section);
    return groups;
  }, {});

const groupExercisesByChapter = (exercises: ExerciseEntry[]) =>
  exercises.reduce<Record<number, ExerciseEntry[]>>((groups, exercise) => {
    groups[exercise.chapterNumber] = groups[exercise.chapterNumber] ?? [];
    groups[exercise.chapterNumber].push(exercise);
    return groups;
  }, {});

export function Sidebar({
  activeContent,
  setActiveContent,
  textbookSections,
  isLoadingTextbookSections,
  textbookSectionsError,
  getTextbookContentId,
  exercises,
  isLoadingExercises,
  exercisesError,
  getExerciseContentId,
}: SidebarProps) {
  const [width, setWidth] = useState(256);
  const textbookSectionsByChapter = useMemo(
    () => groupTextbookSectionsByChapter(textbookSections),
    [textbookSections],
  );
  const exercisesByChapter = useMemo(() => groupExercisesByChapter(exercises), [exercises]);
  const chapterNumbers = useMemo(() => {
    const chapters = new Set([
      ...Object.keys(textbookSectionsByChapter).map(Number),
      ...Object.keys(exercisesByChapter).map(Number),
    ]);

    return [...chapters].sort((first, second) => first - second);
  }, [exercisesByChapter, textbookSectionsByChapter]);

  const handleResizePointerDown = () => {
    const handlePointerMove = (event: PointerEvent) => {
      if (event.buttons !== 1) return;

      const nextWidth = Math.min(Math.max(event.clientX, 220), 420);
      setWidth(nextWidth);
    };

    const handlePointerUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <aside
      className="relative flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white shadow-lg"
      style={{ width }}
    >
      <div className="min-w-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-sky-700">Aural Skills</h1>
          <p className="text-gray-500 text-sm mt-1">An Interactive Textbook</p>
        </div>

        <nav className="p-4">
          <SidebarLink
            label="Introduction"
            active={activeContent === 'intro'}
            onClick={() => setActiveContent('intro')}
          />

          {(isLoadingTextbookSections || isLoadingExercises) && (
            <div className="mt-6 space-y-2 px-4">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-9 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-9 animate-pulse rounded-lg bg-gray-100" />
            </div>
          )}

          {textbookSectionsError && (
            <p className="mt-6 px-4 text-sm text-red-600">
              Textbook sections failed to load.
            </p>
          )}

          {exercisesError && (
            <p className="mt-6 px-4 text-sm text-red-600">
              Exercises failed to load.
            </p>
          )}

          {!isLoadingTextbookSections &&
            !isLoadingExercises &&
            !textbookSectionsError &&
            !exercisesError &&
            chapterNumbers.map((chapterNumber) => (
              <div key={chapterNumber}>
                {!!textbookSectionsByChapter[chapterNumber]?.length && (
                  <SidebarSection title={`Chapter ${chapterNumber}`}>
                    {textbookSectionsByChapter[chapterNumber].map((section) => {
                      const contentId = getTextbookContentId(section.sectionKey);

                      return (
                        <SidebarLink
                          key={section.sys.id}
                          label={section.title}
                          active={activeContent === contentId}
                          onClick={() => setActiveContent(contentId)}
                        />
                      );
                    })}
                  </SidebarSection>
                )}

                {!!exercisesByChapter[chapterNumber]?.length && (
                  <SidebarSection title={`Chapter ${chapterNumber} Exercises`}>
                    {exercisesByChapter[chapterNumber].map((exercise) => {
                      const contentId = getExerciseContentId(exercise.id);

                      return (
                        <SidebarLink
                          key={exercise.sys.id}
                          label={exercise.title}
                          active={activeContent === contentId}
                          onClick={() => setActiveContent(contentId)}
                        />
                      );
                    })}
                  </SidebarSection>
                )}
              </div>
            ))}
        </nav>
      </div>

      <div
        aria-label="Resize sidebar"
        role="separator"
        aria-orientation="vertical"
        onPointerDown={handleResizePointerDown}
        className="absolute right-0 top-0 h-full w-2 cursor-col-resize touch-none bg-transparent transition hover:bg-sky-100"
      />
    </aside>
  );
}
