export function parseSpoilers(text) {
  const parts = text.split(/(\|\|.*?\|\|)/g);

  return parts.map((part, i) => {
    const spoilerMatch = part.match(/^\|\|(.*?)\|\|$/);
    if (spoilerMatch) {
      return {
        type: 'spoiler',
        content: spoilerMatch[1],
        key: i
      };
    } else {
      return {
        type: 'text',
        content: part,
        key: i
      };
    }
  });
}
