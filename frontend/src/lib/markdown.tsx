import type { ReactNode } from 'react';

type PracticeLink = {
  label: string;
  url: string;
};

type MarkdownInlinePart =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'em'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; label: string; url: string };

type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

export const parsePracticeLinks = (value?: string): PracticeLink[] =>
  value
    ?.split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const match = line.match(/^(.+?)\s*-\s*(https?:\/\/\S+)$/i);

      if (!match) {
        return [];
      }

      return [{ label: match[1].trim(), url: match[2].trim() }];
    }) ?? [];

const parseMarkdownBlocks = (value?: string): MarkdownBlock[] => {
  if (!value?.trim()) {
    return [];
  }

  const lines = value.split('\n');
  const blocks: MarkdownBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;

    blocks.push({
      type: 'paragraph',
      text: paragraphLines.join(' '),
    });

    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;

    blocks.push({
      type: 'list',
      items: listItems,
    });

    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1].trim());
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
};

const parseInlineMarkdown = (text: string): MarkdownInlinePart[] => {
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  const parts: MarkdownInlinePart[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const [fullMatch] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, index) });
    }

    if (match[2] && match[3]) {
      parts.push({ type: 'link', label: match[2], url: match[3] });
    } else if (match[5]) {
      parts.push({ type: 'strong', value: match[5] });
    } else if (match[7]) {
      parts.push({ type: 'em', value: match[7] });
    } else if (match[9]) {
      parts.push({ type: 'code', value: match[9] });
    }

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
};

const renderInlineMarkdown = (text: string): ReactNode[] =>
  parseInlineMarkdown(text).map((part, index) => {
    const key = `${part.type}-${index}-${'value' in part ? part.value : part.label}`;

    if (part.type === 'strong') {
      return (
        <strong key={key} className="font-semibold text-gray-950">
          {part.value}
        </strong>
      );
    }

    if (part.type === 'em') {
      return (
        <em key={key} className="italic">
          {part.value}
        </em>
      );
    }

    if (part.type === 'code') {
      return (
        <code key={key} className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.95em] text-gray-800">
          {part.value}
        </code>
      );
    }

    if (part.type === 'link') {
      return (
        <a
          key={key}
          href={part.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-800"
        >
          {part.label}
        </a>
      );
    }

    return <span key={key}>{part.value}</span>;
  });

export function MarkdownContent({ markdown }: { markdown?: string }) {
  const blocks = parseMarkdownBlocks(markdown);

  return (
    <div className="max-w-prose space-y-4">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          if (block.level === 1) {
            return (
              <h1 key={`${block.type}-${index}`} className="pt-3 text-4xl font-bold tracking-tight text-gray-950">
                {renderInlineMarkdown(block.text)}
              </h1>
            );
          }

          if (block.level === 2) {
            return (
              <h2 key={`${block.type}-${index}`} className="pt-3 text-3xl font-semibold tracking-tight text-gray-950">
                {renderInlineMarkdown(block.text)}
              </h2>
            );
          }

          return (
            <h3 key={`${block.type}-${index}`} className="pt-2 text-2xl font-semibold tracking-tight text-gray-900">
              {renderInlineMarkdown(block.text)}
            </h3>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={`${block.type}-${index}`} className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-700">
              {block.items.map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${block.type}-${index}`} className="text-base leading-7 text-gray-700">
            {renderInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}
