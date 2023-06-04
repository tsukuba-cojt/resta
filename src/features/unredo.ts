import { deleteFromAry, pushToAry } from './formatter';

const undoLength = 32;
const undoStack: Array<UnRedoCommands> = [];

let index: number = 0;

export const reDo = () => {
  if (!canRedo()) {
    return;
  }
  applyUndoCommands(undoStack[index++]);
};

export const unDo = () => {
  if (!canUndo()) {
    return;
  }
  applyRedoCommands(undoStack[--index]);
};

export const canRedo = () => {
  return index < undoStack.length;
};

export const canUndo = () => {
  return index > 0;
};

const applyUndoCommands = (changes: UnRedoCommands) => {
  for (const command of changes.commands) {
    applyCommand(command.undo);
  }
};

const applyRedoCommands = (changes: UnRedoCommands) => {
  for (const command of changes.commands) {
    applyCommand(command.redo);
  }
};

export const applyCommand = (change: Command) => {
  switch (change.type) {
    case 'create':
      pushToAry(change.cssSelector, change.cssKey, change.cssValue, change.id);
      break;
    case 'delete':
      deleteFromAry(change.cssSelector, change.cssKey, change.id);
      break;
    case 'rewrite':
      pushToAry(change.cssSelector, change.cssKey, change.cssValue, change.id);
      break;
  }
};

/**
 * undoStackをリセットする
 * サイトの移動時などに呼び出す
 */
export const resetUndoStack = () => {
  undoStack.splice(0, undoStack.length);
  index = 0;
};

export const pushLog = (changes: UnRedoCommands) => {
  // すでに変更がある場合は、そこから先のRedo用の変更を削除する
  if (index < undoStack.length) {
    undoStack.splice(index, undoStack.length - index);
  }
  undoStack.push(changes);
  // undoLengthを超えた場合は先頭を削除する
  if (undoStack.length > undoLength) {
    undoStack.shift();
  }
  index = undoStack.length;
};

export type UnRedoCommands = {
  commands: Array<UnRedoCommand>;
};

export type UnRedoCommand = {
  undo: Command;
  redo: Command;
};

/**
 * 作業を取り消すような変更を表す
 */
export type Command = {
  type: ChangeType;
  cssSelector: string;
  cssKey: string;
  cssValue: string;
  id: number;
  index: number | undefined; // create, rewriteのときのみ。undefinedのときは末尾に追加
};

/**
 * 作業を取り消すような変更の種類
 */
export type ChangeType = 'create' | 'delete' | 'rewrite';
