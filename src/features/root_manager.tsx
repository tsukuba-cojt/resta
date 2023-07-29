import ReactDOM from 'react-dom';
import React from 'react';
import Base from '../components/Base';
import { ChangeStyleCategoryMap } from '../types/ChangeStyleElement';
import { setContainerActive } from '..';
import StyledComponentRegistry from "../components/utils/StyledComponentRegistry";

export const CONTAINER_ID = 'resta-root';

export const initContainer = (categoryMap: ChangeStyleCategoryMap) => {
  const div = document.createElement('div');
  div.setAttribute('id', CONTAINER_ID);
  document.body.insertAdjacentElement('beforeend', div);

  ReactDOM.render(
    <StyledComponentRegistry>
      <Base categoryMap={categoryMap} />
    </StyledComponentRegistry>,
    div
  );

  let mouseDowning = false;
  let baseX = 0;

  div.addEventListener('mousedown', (e: MouseEvent) => {
    const computedStyle = window.getComputedStyle(div);
    const rect = div.getBoundingClientRect();
    if (computedStyle.right === '0px') {
      if (rect.x <= e.clientX && e.clientX <= rect.x + 3) {
        mouseDowning = true;
        baseX = e.clientX;
      }
    } else {
      if (
        rect.x + rect.width <= e.clientX + 3 &&
        e.clientX + 3 <= rect.x + rect.width + 3
      ) {
        mouseDowning = true;
        baseX = e.clientX;
      }
    }
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (mouseDowning) {
      const computedStyle = window.getComputedStyle(div);
      const rect = div.getBoundingClientRect();
      div.style.width =
        computedStyle.right === '0px'
          ? `${rect.width + (baseX - e.clientX)}px`
          : `${rect.width + (e.clientX - baseX)}px`;
      baseX = e.clientX;
    }
  });

  document.addEventListener('mouseup', () => {
    if (mouseDowning) {
      mouseDowning = false;
    }
  });
};

export const closeContainer = () => {
  const root = document.getElementById(CONTAINER_ID);
  if (!root) throw new Error(`#${CONTAINER_ID} is null!`);

  root.style.animationName = 'closeAnimation';
  root.style.animationDuration = '0.25s';
  root.addEventListener(
    'animationend',
    () => {
      root.remove();
    },
    { once: true }
  );
  setContainerActive(false);
};

export const toggleContainerPosition = (): boolean => {
  const root = document.getElementById(CONTAINER_ID);
  if (!root) throw new Error(`#${CONTAINER_ID} is null!`);

  const computedStyle = getComputedStyle(root);
  if (computedStyle.right === '0px') {
    root.style.left = '0';
    root.style.right = 'unset';
    return false;
  } else {
    root.style.right = '0';
    root.style.left = 'unset';
    return true;
  }
};
