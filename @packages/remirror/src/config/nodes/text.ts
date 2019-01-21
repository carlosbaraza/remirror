import { NodeExtension } from '../utils/node-extension';

export class Text extends NodeExtension {
  public readonly name = 'text';

  get schema() {
    return {
      group: 'inline',
    };
  }
}
