import { AbstractCommand } from 'react-command-lib/dist/esm';

export default class CssCommand implements AbstractCommand {
  constructor(
    public execute: () => void,
    public undo: () => void,
  ) {}
}
