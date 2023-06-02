export const kebabToCamel = (text: string): string => {
  const split = text.split('-');
  let result = split[0];

  if (split.length == 1) {
    return result;
  }

  for (let i = 1; i < split.length; i++) {
    result += split[1].toUpperCase()[0] + split[1].substring(1);
  }
  return result;
};
