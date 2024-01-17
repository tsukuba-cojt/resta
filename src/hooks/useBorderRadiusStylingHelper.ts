import React, {useCallback, useLayoutEffect, useRef, useState} from "react";
import useStyleApplier from './useStyleApplier';

type Args = {
  direction: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  border: Border;
  setBorder: React.Dispatch<React.SetStateAction<Border>>;
}

type ReturnType = {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  ref: React.RefObject<HTMLDivElement>;
}

/**
 * つまみによって角丸のサイズを変更するロジックを集めたフック
 */
export default function useBorderRadiusStylingHelper({direction, border, setBorder}: Args): ReturnType {
  const styleApplier = useStyleApplier();
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [start, setStart] = useState<number[]>([0, 0]);
  const isDraggingRef = useRef<boolean>(false);
  const startRef = useRef<number[]>([0, 0]);

  /**
   * つまみの位置を更新する
   */
  const updateKnobPosition = useCallback((r: number) => {
    const style = ref.current!.style;
    const rr = r == null ? (border?.radius ?? 0) : r;
    const delta = (5 + rr) * Math.cos(Math.PI / 4);

    switch (direction) {
      case 'top-left':
        style.top = `${delta}px`;
        style.left = `${delta}px`;
        break;
      case 'top-right':
        style.top = `${delta}px`;
        style.right = `${delta}px`;
        break;
      case 'bottom-right':
        style.bottom = `${delta}px`;
        style.right = `${delta}px`;
        break;
      case 'bottom-left':
        style.bottom = `${delta}px`;
        style.left = `${delta}px`;
        break;
    }
  }, [direction]);

  /**
   * 角丸の値が変更されたときのフック
   */
  useLayoutEffect(() => {
    updateKnobPosition(border?.radius ?? 0);
    startRef.current = start;
    isDraggingRef.current = isDragging;
  }, [border?.radius, direction, isDragging, start, updateKnobPosition]);

  /**
   * 角丸の値を変更する
   */
  const setRadius = useCallback((r: number) => {
    setBorder({
      ...border!,
      radius: Math.floor(r),
    });
    styleApplier.applyStyle(`border-${direction}-radius`, `${Math.floor(r)}px`);
  }, [border, setBorder]);

  /**
   * マウスが動いたときの処理
   */
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) {
      return;
    }

    const x = e.clientX - startRef.current[0];
    const y = e.clientY - startRef.current[1];

    if ((direction === 'top-left' && x < 0 && y < 0)
    || (direction === 'top-right' && x > 0 && y < 0)
    || (direction === 'bottom-right' && x > 0 && y > 0)
    || (direction === 'bottom-left' && x < 0 && y > 0)) {
      setRadius(0);
      updateKnobPosition(0);
      return;
    }

    const delta = Math.sqrt(x * x + y * y);

    updateKnobPosition(delta);
    setRadius(delta);
  }, [direction, setRadius, updateKnobPosition]);

  /**
   * マウスが離されたときの処理
   */
  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  /**
   * マウスが押されたときの処理
   */
  const onMouseDown = useCallback(() => {
    const rect = ref.current!.getBoundingClientRect();
    const startPos = [rect.x + (border?.radius ?? 0) * Math.cos(Math.PI / 4), rect.y + (border?.radius ?? 0) * Math.sin(Math.PI / 4)];
    setStart(startPos);
    setIsDragging(true);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [onMouseMove, onMouseUp]);

  return { onMouseDown, ref }
}