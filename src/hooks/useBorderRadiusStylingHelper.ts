import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useStyleApplier from './useStyleApplier';

type RadiusDirection = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

type Args = {
  direction: RadiusDirection;
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

  type Vector2 = [number, number];

  type RadiusOption = {
    centerVector: Vector2;
    tangentLineVector: Vector2;
    basePosition: Vector2;
  }

  const radiusOptions: Record<RadiusDirection, RadiusOption> = useMemo(() => ({
    'top-left': {
      centerVector: [1, 1],
      tangentLineVector: [-1, 1],
      basePosition: [0, 0],
    },
    'top-right': {
      centerVector: [-1, 1],
      tangentLineVector: [-1, -1],
      basePosition: [1, 0],
    },
    'bottom-right': {
      centerVector: [-1, -1],
      tangentLineVector: [1, -1],
      basePosition: [1, 1],
    },
    'bottom-left': {
      centerVector: [1, -1],
      tangentLineVector: [1, 1],
      basePosition: [0, 1],
    },
  }), []);

  /**
   * つまみの位置を更新する
   */
  const updateKnobPosition = useCallback((r: number) => {
    const style = ref.current!.style;
    const rr = r == null ? (border?.radius ?? 0) : r;
    const delta = ((rr === 0 ? 5 : -2.5) + rr) * Math.cos(Math.PI / 4);

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
    ref.current!.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault()
    };
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

    const parentRect = ref.current!.parentElement!.parentElement!.getBoundingClientRect();
    const options = radiusOptions[direction];

    // 各頂点を基準としたマウスの位置
    const x = e.clientX - parentRect.x - parentRect.width * options.basePosition[0];
    const y = e.clientY - parentRect.y - parentRect.height * options.basePosition[1];

    if (x === 0 && y === 0) {
      updateKnobPosition(0);
      setRadius(0);
      return;
    }

    // 頂点から中心にむかうベクトルとのなす角のcos値
    const angle = (options.centerVector[0] * x + options.centerVector[1] * y) / (Math.sqrt(x * x + y * y) * Math.sqrt(2));

    // 頂点から中心にむかうベクトルとのなす角が180度を超えたら角丸のサイズを0にする
    if (angle <= 0) {
      updateKnobPosition(0);
      setRadius(0);
      return;
    }

    const radius = Math.sqrt(x * x + y * y) * angle;
    updateKnobPosition(radius);
    setRadius(radius);

    // if ((direction === 'top-left' && x < 0 && y < 0)
    // || (direction === 'top-right' && x > 0 && y < 0)
    // || (direction === 'bottom-right' && x > 0 && y > 0)
    // || (direction === 'bottom-left' && x < 0 && y > 0)) {
    //   setRadius(0);
    //   updateKnobPosition(0);
    //   return;
    // }
    //
    // const delta = Math.sqrt(x * x + y * y);
    //
    // updateKnobPosition(delta);
    // setRadius(delta);
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