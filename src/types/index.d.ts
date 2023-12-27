type SelectedElement = {
  overlayElement: HTMLDivElement;
  element: HTMLElement;
}

type Border = {
  type: 'solid' | 'dashed' | 'dotted' | undefined;
  width: number | undefined;
  color: string | undefined;
  radius: number | undefined;
}

type Direction = 'top' | 'right' | 'bottom' | 'left';