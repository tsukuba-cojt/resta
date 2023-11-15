import { AbstractCommand } from 'react-command-lib/dist/esm';

export default class UnRedoCommand implements AbstractCommand {
  constructor(cssSelector: string, cssKey: string, id: string) {
    this.cssSelector = cssSelector;
    this.cssKey = cssKey;
    this.id = id;
  }
  cssSelector: string;
  cssKey: string;
  id: string;
  index: number | undefined;
  execute(): void {}
  undo(): void {}
}
