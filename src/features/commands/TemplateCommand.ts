import { AbstractCommand } from 'react-command-lib/dist/esm';
import CssCommand from './CssCommand';

export default class TemplateCommand implements AbstractCommand {
  constructor(...commands: CssCommand[]) {
    this.execute = () => {
      commands.forEach((command) => {
        command.execute();
      });
    };
    this.undo = () => {
      commands.forEach((command) => {
        command.undo();
      });
    };
  }
  execute: () => void;
  undo: () => void;
}
