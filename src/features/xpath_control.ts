export const getElementByXpath = (path:string|null) => {
  if (!path) {
    return null;
  }
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as HTMLElement;
};
