import { Fragment } from 'react';
import { cn } from '@/lib/utils';

interface InlineToken {
  type: 'text' | 'bold' | 'italic' | 'underline' | 'code' | 'link';
  content: string;
  href?: string;
}

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(__(.+?)__)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }

    if (match[2]) {
      tokens.push({ type: 'bold', content: match[2] });
    } else if (match[4]) {
      tokens.push({ type: 'italic', content: match[4] });
    } else if (match[6]) {
      tokens.push({ type: 'underline', content: match[6] });
    } else if (match[8]) {
      tokens.push({ type: 'code', content: match[8] });
    } else if (match[10]) {
      tokens.push({ type: 'link', content: match[10], href: match[11] });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return tokens;
}

function renderInline(tokens: InlineToken[]) {
  return tokens.map((t, i) => {
    switch (t.type) {
      case 'bold':
        return (
          <strong key={i} className="font-semibold text-foreground">
            {t.content}
          </strong>
        );
      case 'italic':
        return (
          <em key={i} className="italic">
            {t.content}
          </em>
        );
      case 'underline':
        return (
          <u key={i} className="underline decoration-foreground/30 decoration-dotted underline-offset-2">
            {t.content}
          </u>
        );
      case 'code':
        return (
          <code
            key={i}
            className="rounded-sm border border-foreground/8 bg-foreground/5 px-1 py-0.5 font-mono text-[0.85em] text-primary"
          >
            {t.content}
          </code>
        );
      case 'link':
        return (
          <a
            key={i}
            href={t.href}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary/80"
          >
            {t.content}
          </a>
        );
      default:
        return <Fragment key={i}>{t.content}</Fragment>;
    }
  });
}

interface RichTextProps {
  content: string;
  className?: string;
}

export default function RichText({ content, className }: RichTextProps) {
  const blocks = content.split(/\n\n+/);

  return (
    <div
      className={cn(
        'max-w-[72ch] space-y-4 font-sans text-[15px] leading-7 text-foreground/85 text-pretty',
        className,
      )}
    >
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={i}
              className="pt-4 text-lg font-semibold tracking-tight text-foreground text-balance first:pt-0"
            >
              {renderInline(parseInline(trimmed.slice(4)))}
            </h3>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4
              key={i}
              className="pt-2 text-[15px] font-semibold text-foreground first:pt-0"
            >
              {renderInline(parseInline(trimmed.slice(5)))}
            </h4>
          );
        }

        if (trimmed.startsWith('- ')) {
          const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
          return (
            <ul key={i} className="list-none space-y-2 pl-0">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="mt-3 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-primary/60" />
                  <span>{renderInline(parseInline(item.slice(2)))}</span>
                </li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{renderInline(parseInline(trimmed))}</p>;
      })}
    </div>
  );
}
