import SpoilerText from './SpoilerText';
import { parseSpoilers } from '@/utils/parseSpoilers';

export default function ReviewText({ content }) {
  const parts = parseSpoilers(content);

  return (
    <p className="whitespace-pre-wrap mt-1 text-black text-sm">
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
