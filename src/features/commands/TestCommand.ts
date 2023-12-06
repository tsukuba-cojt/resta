import { AbstractCommand } from 'react-command-lib/dist/esm';

export default class TestCommand implements AbstractCommand {
  constructor() {}
  execute(): void {}
  undo(): void {}
}
//　context.executor.execute(new TestCommand());
