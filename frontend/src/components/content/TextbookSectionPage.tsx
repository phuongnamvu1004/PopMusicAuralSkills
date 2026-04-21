import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MarkdownContent, parsePracticeLinks } from '../../lib/markdown';
import {
  getTextbookSectionBySectionKey,
  type TextbookSectionEntry,
} from '../../lib/contentful/textbook-sections';

type TextbookSectionPageProps = {
  sectionKey: string;
  missingTitle: string;
  missingMessage?: string;
};

const normalizeAssetUrl = (url?: string) => {
  if (!url) return null;
  if (url.startsWith('//')) return `https:${url}`;
  return url;
};

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
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-4xl">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-red-800">Unable to load section</h2>
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
}

function SectionContent({ section }: { section: TextbookSectionEntry }) {
  const practiceLinks = parsePracticeLinks(section.practiceLinks);
  const headerImageUrl = normalizeAssetUrl(section.headerVisual?.url);

  return (
    <div className="max-w-4xl">
      <h2 className="mb-2">{section.title}</h2>
      <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-sky-700">
        Chapter {section.chapterNumber} · Section {section.sectionCode}
      </p>

      {headerImageUrl && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <ImageWithFallback
            src={headerImageUrl}
            alt={section.headerVisual?.description || section.headerVisual?.title || section.title}
            className="h-64 w-full object-cover"
          />
          {section.headerCaption && (
            <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
              {section.headerCaption}
            </div>
          )}
        </div>
      )}

      <MarkdownContent markdown={section.description} />

      {!!practiceLinks.length && (
        <div className="mt-6 rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 p-6">
          <h4 className="mb-2">Practice Links</h4>
          <div className="space-y-3">
            {practiceLinks.map((link) => (
              <p key={link.url} className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{link.label}</span>{' '}
                <span className="text-gray-500">-</span>{' '}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-800"
                >
                  {link.url}
                </a>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TextbookSectionPage({
  sectionKey,
  missingTitle,
  missingMessage = 'This level is currently being developed. Check back soon for new ear training content!',
}: TextbookSectionPageProps) {
  const [section, setSection] = useState<TextbookSectionEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSection = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSection = await getTextbookSectionBySectionKey(sectionKey);

        if (cancelled) return;

        setSection(nextSection);
      } catch (nextError) {
        if (cancelled) return;

        setSection(null);
        setError(nextError instanceof Error ? nextError.message : 'Failed to load section content.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadSection();

    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!section) {
    return <ComingSoonCard title={missingTitle} message={missingMessage} />;
  }

  return <SectionContent section={section} />;
}
