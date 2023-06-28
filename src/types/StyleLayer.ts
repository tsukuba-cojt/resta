export type StyleLayer = {
  key: string;
  children: StyleLayerValue[];
};

export type StyleLayerValue = {
  cssKey: string;
  id: number | string;
  url: string;
  value: string;
};
