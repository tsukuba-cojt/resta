import { AbstractCommand } from 'react-command-lib/dist/esm';
import CssCommand from './CssCommand';

export default class TemplateCommand implements AbstractCommand {
  constructor(...templates: CssCommand[]) {
    this.execute = () => {
      templates.forEach((template) => {
        template.execute();
      });
    };
    this.undo = () => {
      templates.forEach((template) => {
        template.undo();
      });
    };
  }
  execute: () => void;
  undo: () => void;
}
