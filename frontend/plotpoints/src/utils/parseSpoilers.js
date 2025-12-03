export function parseSpoilers(text) {
  if (typeof text !== 'string') {
    return [{
      type: 'text',
      content: '',
      key: 0
    }];
  }

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
