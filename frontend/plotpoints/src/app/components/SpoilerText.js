'use client';
import { useState } from 'react';

export default function SpoilerText({ text }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      onClick={() => setRevealed(!revealed)}
      className="cursor-pointer rounded transition-all duration-200"
      style={{
        backgroundColor: revealed ? 'transparent' : 'black',
        color: revealed ? 'inherit' : 'transparent',
        borderRadius: '0.25rem',
        padding: '0 0.1em',
        userSelect: revealed ? 'text' : 'none',
      }}
    >
      {/* Basically what this does is preserve the size of the spoiler text region when its hidden */}
      {text.split('').map((char, i) => (
        <span key={i} style={{ opacity: revealed ? 1 : 0 }}>
          {char}
        </span>
      ))}
    </span>
  );
}
