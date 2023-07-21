export type FormatBlockByURL = {
  url: string;
  formats: Array<Format>;
};

export type Format = {
  cssSelector: string;
  changes: Array<FormatChange>;
};

export type FormatChange = {
  cssKey: string;
  cssValues: Array<FormatStyleValue>;
};

export type FormatStyleValue = {
  id: number | string;
  cssValue: string;
};
