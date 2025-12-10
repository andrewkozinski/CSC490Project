import SpoilerText from './SpoilerText';
import { parseSpoilers } from '@/utils/parseSpoilers';
import '@/app/components/Homepage.css';

export default function ReviewText({ content, className }) {
  const parts = parseSpoilers(content);

  return (
    <p className={`whitespace-pre-wrap ${className}`} style={{ overflowWrap: 'anywhere' }}>
      {parts.map((part) =>
        part.type === 'spoiler' ? (
          <SpoilerText key={part.key} text={part.content} />
        ) : (
          <span key={part.key}>{part.content}</span>
        )
      )}
    </p>
  );
}
