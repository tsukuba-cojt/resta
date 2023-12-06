export const matchUrl = (currentUrl: string, matchUrl: string) => {
  if (!matchUrl || !currentUrl) {
    return false;
  }
  let hasWildcard = false;
  let compareUrl = '';
  // 最後の文字が*ならワイルドカードとして扱う
  if (matchUrl[matchUrl.length - 1] === '*') {
    hasWildcard = true;
    compareUrl = matchUrl.slice(0, -1);
  }
  if (hasWildcard) {
    return currentUrl === compareUrl || currentUrl.startsWith(compareUrl);
  } else {
    return currentUrl === matchUrl;
  }
};
