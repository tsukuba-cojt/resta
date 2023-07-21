import {
  UnRedoCommands,
  UnRedoCommand,
  Command,
} from '../types/UnRedoCommands';
import { saveFormat } from './format_manager';
import { deleteFromAry, pushToAry } from './formatter';
import { updateFormat } from './prop';
import * as resta_console from './resta_console';

const UNREDO_MAX_LENGTH = 32;
const unRedoStack: Array<UnRedoCommands> = [];

let index: number = 0;

export const reDo = (): void => {
  if (!canRedo()) {
    return;
  }
  applyRedoCommands(unRedoStack[index++]);
};

export const unDo = (): void => {
  if (!canUndo()) {
    return;
  }
  applyUndoCommands(unRedoStack[--index]);
};

export const canRedo = (): boolean => {
  return index < unRedoStack.length;
};

export const canUndo = (): boolean => {
  return index > 0;
};

/**
 * undoStackをリセットする
 * サイトの移動時などに呼び出す
 */
export const resetUndoStack = () => {
  unRedoStack.splice(0, unRedoStack.length);
  index = 0;
};

export const pushLog = (changes: UnRedoCommands) => {
  if (changes.commands.length === 0) {
    return;
  }
  // すでに変更がある場合は、そこから先のRedo用の変更を削除する
  if (index < unRedoStack.length) {
    unRedoStack.splice(index, unRedoStack.length - index);
  }
  const lastChanges = unRedoStack[unRedoStack.length - 1];
  // 直前の変更と同じidの場合は、直前の変更とマージする
  if (
    lastChanges &&
    lastChanges.commands[0] &&
    lastChanges.commands[0].id !== 0 &&
    lastChanges.commands[0].id === changes.commands[0].id &&
    lastChanges.commands[0].redo.type !== 'delete' &&
    changes.commands[0].redo.type !== 'delete' &&
    lastChanges.commands
      .map((x) => x.cssSelector)
      .sort()
      .toString() ===
      changes.commands
        .map((x) => x.cssSelector)
        .sort()
        .toString()
  ) {
    unRedoStack.pop();
    unRedoStack.push(margeCommands(lastChanges, changes));
  } else {
    // マージの必要がない場合は、そのままundoStackに追加する
    unRedoStack.push(changes);
  }

  // undoLengthを超えた場合は先頭を削除する
  if (unRedoStack.length > UNREDO_MAX_LENGTH) {
    unRedoStack.shift();
  }
  index = unRedoStack.length;
  resta_console.log('pushLog', unRedoStack);
  saveFormat();
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
    const nextCommandIndex = nextCommands
      .filter((e) => e.id === prevCommand.id)
      .findIndex(
        (e) =>
          e.cssSelector === prevCommand.cssSelector &&
          e.cssKey === prevCommand.cssKey
      );
    if (nextCommandIndex === -1) {
      // nextCommandsにprevCommandと同じidの変更がない場合は、prevCommandをそのまま追加する
      margedCommands.push(prevCommand);
      continue;
    }
    const nextCommand = nextCommands.splice(nextCommandIndex, 1)[0];
    switch (prevCommand.redo.type) {
      case 'create':
        if (nextCommand.redo.type === 'rewrite') {
          margedCommands.push({
            cssSelector: prevCommand.cssSelector,
            cssKey: prevCommand.cssKey,
            id: prevCommand.id,
            undo: {
              type: 'delete',
              cssValue: '',
              index: undefined,
            },
            redo: {
              type: 'create',
              cssValue: nextCommand.redo.cssValue,
              index: nextCommand.redo.index,
            },
          });
        } else {
          resta_console.log('margeCommands: bug detected, create -> create');
          return { commands: [] };
        }
        break;
      case 'rewrite':
        if (nextCommand.redo.type === 'rewrite') {
          margedCommands.push({
            cssSelector: prevCommand.cssSelector,
            cssKey: prevCommand.cssKey,
            id: prevCommand.id,
            undo: {
              type: 'rewrite',
              cssValue: prevCommand.undo.cssValue,
              index: prevCommand.undo.index,
            },
            redo: {
              type: 'rewrite',
              cssValue: nextCommand.redo.cssValue,
              index: nextCommand.redo.index,
            },
          });
        } else {
          resta_console.log('margeCommands: bug detected, rewrite -> create');
          return { commands: [] };
        }
        break;
      default:
        resta_console.log('margeCommands: bug detected, try to marge delete');
        return { commands: [] };
    }
  }
  nextCommands.forEach((element) => {
    margedCommands.push(element);
  });
  return { commands: margedCommands } as UnRedoCommands;
};

const applyUndoCommands = (changes: UnRedoCommands) => {
  for (const command of changes.commands) {
    applyCommand(command.cssSelector, command.cssKey, command.id, command.undo);
  }
  saveFormat();
};

const applyRedoCommands = (changes: UnRedoCommands) => {
  for (const command of changes.commands) {
    applyCommand(command.cssSelector, command.cssKey, command.id, command.redo);
  }
  saveFormat();
};

export const applyCommand = (
  cssSelector: string,
  cssKey: string,
  id: number | string,
  change: Command
) => {
  resta_console.log('applyCommand', cssSelector, cssKey, id, change);
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
  updateFormat(cssSelector, cssKey);
};
