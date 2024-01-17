import React, {useCallback, useRef, useState} from "react";
import useStyleApplier from './useStyleApplier';
import { Color } from 'antd/es/color-picker';

type ReturnType = {
  onMouseDownOnMarginStyler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseDownOnPaddingStyler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseClickOnMarginStyler: VoidFunction;
  onMouseClickOnPaddingStyler: VoidFunction;
  marginTop: number | undefined;
  marginRight: number | undefined;
  marginBottom: number | undefined;
  marginLeft: number | undefined;
  borderTopLeft: Border;
  borderTopRight: Border;
  borderBottomRight: Border;
  borderBottomLeft: Border;
  paddingTop: number | undefined;
  paddingRight: number | undefined;
  paddingBottom: number | undefined;
  paddingLeft: number | undefined;
  backgroundColor: string | Color | undefined;
  isMarginSelected: boolean;
  isPaddingSelected: boolean;
  isBorderSelected: boolean;
  setMarginTop: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMarginRight: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMarginBottom: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMarginLeft: React.Dispatch<React.SetStateAction<number | undefined>>;
  setBorderTopLeft: React.Dispatch<React.SetStateAction<Border>>;
  setBorderTopRight: React.Dispatch<React.SetStateAction<Border>>;
  setBorderBottomRight: React.Dispatch<React.SetStateAction<Border>>;
  setBorderBottomLeft: React.Dispatch<React.SetStateAction<Border>>;
  setPaddingTop: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPaddingRight: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPaddingBottom: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPaddingLeft: React.Dispatch<React.SetStateAction<number | undefined>>;
  setIsMarginSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaddingSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBorderSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string | Color | undefined>>;
}

const DIRECTION_RIGHT = 0;
const DIRECTION_LEFT = 1;
const DIRECTION_TOP = 2;
const DIRECTION_BOTTOM = 3;

const emptyBorder: Border = {
  width: undefined,
  style: undefined,
  color: undefined,
  radius: undefined,
};

/**
 * インタラクティブなブロックスタイリング機能のロジックを集めたフック
 */
export default function useInteractiveStylingHelper(): ReturnType {
  const styleApplier = useStyleApplier();

  const mouseStart = useRef<number[]>([0, 0]);
  const direction = useRef<number>(0);
  const isMarginDragging = useRef<boolean>(false);
  const isPaddingDragging = useRef<boolean>(false);

  const [marginTop, setMarginTop] = useState<number | undefined>(undefined);
  const [marginRight, setMarginRight] = useState<number | undefined>(undefined);
  const [marginBottom, setMarginBottom] = useState<number | undefined>(undefined);
  const [marginLeft, setMarginLeft] = useState<number | undefined>(undefined);
  const [borderTopLeft, setBorderTopLeft] = useState<Border>(Object.assign({}, emptyBorder));
  const [borderTopRight, setBorderTopRight] = useState<Border>(Object.assign({}, emptyBorder));
  const [borderBottomRight, setBorderBottomRight] = useState<Border>(Object.assign({}, emptyBorder));
  const [borderBottomLeft, setBorderBottomLeft] = useState<Border>(Object.assign({}, emptyBorder));
  const [paddingTop, setPaddingTop] = useState<number | undefined>(undefined);
  const [paddingRight, setPaddingRight] = useState<number | undefined>(undefined);
  const [paddingBottom, setPaddingBottom] = useState<number | undefined>(undefined);
  const [paddingLeft, setPaddingLeft] = useState<number | undefined>(undefined);
  const [backgroundColor, setBackgroundColor] = useState<string | Color | undefined>(undefined);

  const [isMarginSelected, setIsMarginSelected] = useState<boolean>(false);
  const [isPaddingSelected, setIsPaddingSelected] = useState<boolean>(true);
  const [isBorderSelected, setIsBorderSelected] = useState<boolean>(false);

  /**
   * リサイズ可能な要素上でマウスが動いたときのイベントハンドラ
   */
  const onMouseMove = useCallback((e: MouseEvent) => {
    const deltaX = e.clientX - mouseStart.current[0];
    const deltaY = e.clientY - mouseStart.current[1];

    switch (true) {
      case isMarginDragging.current: {
        switch (direction.current) {
          case DIRECTION_TOP: {
            const value = Math.max(0, (marginTop ?? 0) - deltaY);
            setMarginTop(value);
            styleApplier.applyStyle('margin-top', `${value}px`);
            break;
          }
          case DIRECTION_RIGHT: {
            const value = Math.max(0, (marginRight ?? 0) + deltaX);
            setMarginRight(value);
            styleApplier.applyStyle('margin-right', `${value}px`);
            break;
          }
          case DIRECTION_BOTTOM: {
            const value = Math.max(0, (marginBottom ?? 0) + deltaY);
            setMarginBottom(value);
            styleApplier.applyStyle('margin-bottom', `${value}px`);
            break;
          }
          case DIRECTION_LEFT: {
            const value = Math.max(0, (marginLeft ?? 0) - deltaX);
            setMarginLeft(value);
            styleApplier.applyStyle('margin-left', `${value}px`);
            break;
          }
        }
        break;
      }

      case isPaddingDragging.current: {
        switch (direction.current) {
          case DIRECTION_TOP: {
            const value = Math.max(0, (paddingTop ?? 0) - deltaY);
            setPaddingTop(value);
            styleApplier.applyStyle('padding-top', `${value}px`);
            break;
          }
          case DIRECTION_RIGHT: {
            const value = Math.max(0, (paddingRight ?? 0) + deltaX);
            setPaddingRight(value);
            styleApplier.applyStyle('padding-right', `${value}px`);
            break;
          }
          case DIRECTION_BOTTOM: {
            const value = Math.max(0, (paddingBottom ?? 0) + deltaY);
            setPaddingBottom(value);
            styleApplier.applyStyle('padding-bottom', `${value}px`);
            break;
          }
          case DIRECTION_LEFT: {
            const value = Math.max(0, (paddingLeft ?? 0) - deltaX);
            setPaddingLeft(value);
            styleApplier.applyStyle('padding-left', `${value}px`);
            break;
          }
        }
        break;
      }
    }
  }, [marginBottom, marginLeft, marginRight, marginTop, paddingBottom, paddingLeft, paddingRight, paddingTop]);

  /**
   * ドキュメント上でマウスが離れたときのイベントハンドラ
   */
  const onMouseUp = useCallback(() => {
    isMarginDragging.current = false;
    isPaddingDragging.current = false;
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  /**
   * ドキュメント上でマウスが押されたときのイベントハンドラ
   */
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

  /**
   * リサイズ可能なコンポーネント上でマウスがクリックされたときのイベントハンドラ
   */
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
    backgroundColor,
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
    setBackgroundColor,
  }
}