import { ChangeType } from '../features/unredo';

export type UnRedoCommands = {
  commands: Array<UnRedoCommand>;
};

export type UnRedoCommand = {
  cssSelector: string;
  cssKey: string;
  id: number | string;
  undo: Command;
  redo: Command;
};

export type Command = {
  type: ChangeType;
  cssValue: string;
  /**
   * create, rewriteのときのみ。undefinedのときは末尾に追加
   */
  index: number | undefined;
};
