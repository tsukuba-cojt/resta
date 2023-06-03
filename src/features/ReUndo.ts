const undoLength = 32;
let undoStack: Array<UnRedoChanges> = [];

let index: number = 0;

export const reDo = () => {
  if (!canRedo()) {
    return;
  }
  applyUndoChanges(undoStack[index++]);
};

export const unDo = () => {
  if (!canUndo()) {
    return;
  }
  applyRedoChanges(undoStack[--index]);
};

export const canRedo = () => {
  return index < undoStack.length;
};

export const canUndo = () => {
  return index > 0;
};

export const applyUndoChanges = (changes: UnRedoChanges) => {};

export const applyRedoChanges = (changes: UnRedoChanges) => {};

export const applyUnRedoChange = (change: ChangeValue) => {
  switch (change.type) {
    case 'create':
      break;
    case 'delete':
      break;
    case 'rewrite':
      break;
  }
};

/**
 * undoStackをリセットする
 * サイトの移動時などに呼び出す
 */
export const resetUndoStack = () => {
  undoStack = [];
  index = 0;
};

export const pushLog = (changes: UnRedoChanges) => {
  // すでに変更がある場合は、そこから先のRedo用の変更を削除する
  if (index < undoStack.length) {
    undoStack = undoStack.slice(0, index);
  }
  undoStack.push(changes);
  // undoLengthを超えた場合は先頭を削除する
  if (undoStack.length > undoLength) {
    undoStack.shift();
  }
  index = undoStack.length;
};

export type UnRedoChanges = {
  changes: Array<UnRedo>;
};

export type UnRedo = {
  undo: ChangeValue;
  redo: ChangeValue;
};

/**
 * 作業を取り消すような変更を表す
 */
export type ChangeValue = {
  type: ChangeType;
  xpath: string;
  cssKey: string;
  cssValue: string;
  id: number;
  index: number | undefined; // create, rewriteのときのみ。undefinedのときは末尾に追加
};

/**
 * 作業を取り消すような変更の種類
 */
export type ChangeType = 'create' | 'delete' | 'rewrite';
