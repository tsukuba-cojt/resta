import React, {useCallback, useRef, useState} from "react";

type ReturnType = {
  onMouseDownOnMarginStyler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseDownOnPaddingStyler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseClickOnMarginStyler: VoidFunction;
  onMouseClickOnPaddingStyler: VoidFunction;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  borderTopLeft: Border | undefined;
  borderTopRight: Border | undefined;
  borderBottomRight: Border | undefined;
  borderBottomLeft: Border | undefined;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  isMarginSelected: boolean;
  isPaddingSelected: boolean;
  isBorderSelected: boolean;
  setMarginTop: React.Dispatch<React.SetStateAction<number>>;
  setMarginRight: React.Dispatch<React.SetStateAction<number>>;
  setMarginBottom: React.Dispatch<React.SetStateAction<number>>;
  setMarginLeft: React.Dispatch<React.SetStateAction<number>>;
  setBorderTopLeft: React.Dispatch<React.SetStateAction<Border | undefined>>;
  setBorderTopRight: React.Dispatch<React.SetStateAction<Border | undefined>>;
  setBorderBottomRight: React.Dispatch<React.SetStateAction<Border | undefined>>;
  setBorderBottomLeft: React.Dispatch<React.SetStateAction<Border | undefined>>;
  setPaddingTop: React.Dispatch<React.SetStateAction<number>>;
  setPaddingRight: React.Dispatch<React.SetStateAction<number>>;
  setPaddingBottom: React.Dispatch<React.SetStateAction<number>>;
  setPaddingLeft: React.Dispatch<React.SetStateAction<number>>;
  setIsMarginSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaddingSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBorderSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const DIRECTION_RIGHT = 0;
const DIRECTION_LEFT = 1;
const DIRECTION_TOP = 2;
const DIRECTION_BOTTOM = 3;

export default function useInteractiveStylingHelper(): ReturnType {
  const mouseStart = useRef<number[]>([0, 0]);
  const direction = useRef<number>(0);
  const isMarginDragging = useRef<boolean>(false);
  const isPaddingDragging = useRef<boolean>(false);

  const [marginTop, setMarginTop] = useState<number>(10);
  const [marginRight, setMarginRight] = useState<number>(10);
  const [marginBottom, setMarginBottom] = useState<number>(10);
  const [marginLeft, setMarginLeft] = useState<number>(10);
  const [borderTopLeft, setBorderTopLeft] = useState<Border | undefined>();
  const [borderTopRight, setBorderTopRight] = useState<Border | undefined>(undefined);
  const [borderBottomRight, setBorderBottomRight] = useState<Border | undefined>(undefined);
  const [borderBottomLeft, setBorderBottomLeft] = useState<Border | undefined>(undefined);
  const [paddingTop, setPaddingTop] = useState<number>(10);
  const [paddingRight, setPaddingRight] = useState<number>(10);
  const [paddingBottom, setPaddingBottom] = useState<number>(10);
  const [paddingLeft, setPaddingLeft] = useState<number>(10);
  const [isMarginSelected, setIsMarginSelected] = useState<boolean>(false);
  const [isPaddingSelected, setIsPaddingSelected] = useState<boolean>(true);
  const [isBorderSelected, setIsBorderSelected] = useState<boolean>(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const deltaX = e.clientX - mouseStart.current[0];
    const deltaY = e.clientY - mouseStart.current[1];

    switch (true) {
      case isMarginDragging.current: {
        switch (direction.current) {
          case DIRECTION_TOP:
            setMarginTop(Math.max(0, marginTop - deltaY));
            break;
          case DIRECTION_RIGHT:
            setMarginRight(Math.max(0, marginRight + deltaX));
            break;
          case DIRECTION_BOTTOM:
            setMarginBottom(Math.max(0, marginBottom + deltaY));
            break;
          case DIRECTION_LEFT:
            setMarginLeft(Math.max(0, marginLeft - deltaX));
            break;
        }
        break;
      }

      case isPaddingDragging.current: {
        switch (direction.current) {
          case DIRECTION_TOP:
            setPaddingTop(Math.max(0, paddingTop - deltaY));
            break;
          case DIRECTION_RIGHT:
            setPaddingRight(Math.max(0, paddingRight + deltaX));
            break;
          case DIRECTION_BOTTOM:
            setPaddingBottom(Math.max(0, paddingBottom + deltaY));
            break;
          case DIRECTION_LEFT:
            setPaddingLeft(Math.max(0, paddingLeft - deltaX));
            break;
        }
        break;
      }
    }
  }, [marginBottom, marginLeft, marginRight, marginTop, paddingBottom, paddingLeft, paddingRight, paddingTop]);

  const onMouseUp = useCallback(() => {
    isMarginDragging.current = false;
    isPaddingDragging.current = false;
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  const onMouseDown = useCallback((margin: boolean, padding: boolean, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isMarginDragging.current = isMarginSelected && margin;
    isPaddingDragging.current = isPaddingSelected && padding;

    if (!isMarginDragging.current && !isPaddingDragging.current) {
      return;
    }

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    mouseStart.current = [e.clientX, e.clientY];

    const id = (e.target as HTMLDivElement).id;
    switch (id) {
      case 'resta-resize-top':
        direction.current = DIRECTION_TOP;
        break;
      case 'resta-resize-right':
        direction.current = DIRECTION_RIGHT;
        break;
      case 'resta-resize-bottom':
        direction.current = DIRECTION_BOTTOM;
        break;
      case 'resta-resize-left':
        direction.current = DIRECTION_LEFT;
        break;
      default:
        direction.current = -1;
    }
  }, [isMarginSelected, isPaddingSelected, onMouseMove, onMouseUp]);

  const onMouseClick = useCallback((margin: boolean, padding: boolean, border: boolean) => {
    setIsMarginSelected(margin);
    setIsPaddingSelected(padding);
    setIsBorderSelected(border);
  }, []);

  const onMouseDownOnMarginStyler = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onMouseDown(true, false, e);
  }, [onMouseDown]);

  const onMouseDownOnPaddingStyler = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onMouseDown(false, true, e);
  }, [onMouseDown]);

  const onMouseClickOnMarginStyler = useCallback(() => {
    onMouseClick(true, false, false);
  }, [onMouseClick]);

  const onMouseClickOnPaddingStyler = useCallback(() => {
    onMouseClick(false, true, false);
  }, [onMouseClick]);

  return {
    onMouseDownOnMarginStyler,
    onMouseDownOnPaddingStyler,
    onMouseClickOnMarginStyler,
    onMouseClickOnPaddingStyler,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    borderTopLeft,
    borderTopRight,
    borderBottomRight,
    borderBottomLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    isMarginSelected,
    isPaddingSelected,
    isBorderSelected,
    setMarginLeft,
    setMarginRight,
    setMarginTop,
    setMarginBottom,
    setBorderTopLeft,
    setBorderTopRight,
    setBorderBottomRight,
    setBorderBottomLeft,
    setPaddingTop,
    setPaddingRight,
    setPaddingBottom,
    setPaddingLeft,
    setIsMarginSelected,
    setIsPaddingSelected,
    setIsBorderSelected,
  }
}