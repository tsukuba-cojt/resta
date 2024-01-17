type SelectedElement = {
  overlayElement: HTMLDivElement;
  element: HTMLElement;
}

type BorderStyle = 'solid' | 'dashed' | 'dotted' | undefined;

type Border = {
  style: BorderStyle;
  width: number | undefined;
  color: string | undefined;
  radius: number | undefined;
}

type Direction = 'top' | 'right' | 'bottom' | 'left';