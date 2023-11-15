import { AbstractCommand } from 'react-command-lib/dist/esm';
import { IPropsContext } from '../../contexts/PropsContext';

export default class CSSCommand implements AbstractCommand {
  constructor(
    props: IPropsContext,
    cssSelector: string,
    cssKey: string,
    id: string,
  ) {
    this.cssSelector = cssSelector;
    this.cssKey = cssKey;
    this.id = id;
    this.props = props;
  }
  cssSelector: string;
  cssKey: string;
  id: string;
  index: number | undefined;
  props: IPropsContext;
  execute(): void {}
  undo(): void {}
}
