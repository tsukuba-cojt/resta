import { deleteFromAry, pushToAry, reloadStyle } from './formatter';

const undoLength = 32;
const undoStack: Array<UnRedoCommands> = [];

let index: number = 0;

export const reDo = (): void => {
  if (!canRedo()) {
    return;
  }
  applyUndoCommands(undoStack[index++]);
};

export const unDo = (): void => {
  if (!canUndo()) {
    return;
  }
  applyRedoCommands(undoStack[--index]);
};

export const canRedo = (): boolean => {
  return index < undoStack.length;
};

export const canUndo = (): boolean => {
  return index > 0;
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
  const lastChanges = undoStack[undoStack.length - 1];
  // 直前の変更と同じidの場合は、直前の変更とマージする
  if (
    lastChanges &&
    lastChanges.commands[0].id !== 0 &&
    lastChanges.commands[0].id === changes.commands[0].id
  ) {
    undoStack.pop();
    undoStack.push(margeCommands(lastChanges, changes));
  } else {
    // マージの必要がない場合は、そのままundoStackに追加する
    undoStack.push(changes);
  }

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
  cssSelector: string;
  cssKey: string;
  id: number;
  undo: Command;
  redo: Command;
};

/**
 * 作業を取り消すような変更を表す
 */
export type Command = {
  type: ChangeType;
  cssValue: string;
  index: number | undefined; // create, rewriteのときのみ。undefinedのときは末尾に追加
};

/**
 * 作業を取り消すような変更の種類
 */
export type ChangeType = 'create' | 'delete' | 'rewrite';

const margeCommands = (
  prev: UnRedoCommands,
  next: UnRedoCommands
): UnRedoCommands => {
  const prevCommands = prev.commands;
  const nextCommands = next.commands;
  const margedCommands: Array<UnRedoCommand> = [];
  for (const prevCommand of prevCommands) {
    const nextCommand = nextCommands
      .filter((e) => e.id === prevCommand.id)
      .find(
        (e) =>
          e.cssSelector === prevCommand.cssSelector &&
          e.cssKey === prevCommand.cssKey
      );
    if (nextCommand) {
      if ([prevCommand.redo]) {
      }
    }
  }
  return { commands: margedCommands } as UnRedoCommands;
};

const applyUndoCommands = (changes: UnRedoCommands) => {
  for (const command of changes.commands) {
    applyCommand(command.cssSelector, command.cssKey, command.id, command.undo);
  }
};

const applyRedoCommands = (changes: UnRedoCommands) => {
  for (const command of changes.commands) {
    applyCommand(command.cssSelector, command.cssKey, command.id, command.redo);
  }
};

export const applyCommand = (
  cssSelector: string,
  cssKey: string,
  id: number,
  change: Command
) => {
  switch (change.type) {
    case 'create':
      pushToAry(cssSelector, cssKey, change.cssValue, id);
      break;
    case 'delete':
      deleteFromAry(cssSelector, cssKey, id);
      break;
    case 'rewrite':
      pushToAry(cssSelector, cssKey, change.cssValue, id);
      break;
  }
  reloadStyle(cssSelector, cssKey);
};
