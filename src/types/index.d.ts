type SelectedElement = {
  overlayElement: HTMLDivElement;
  element: HTMLElement;
}

type Border = {
  type: 'solid' | 'dashed' | 'dotted';
  width: number;
  color: string;
  radius: number;
}