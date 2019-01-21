import { isString } from 'lodash';
import { MarkSpec } from 'prosemirror-model';
import { Cast } from '../../helpers';
import { SchemaMarkTypeParams } from '../../types';
import { toggleMark } from '../commands';
import { markInputRule } from '../commands/mark-input-rule';
import { MarkExtension } from '../utils';

export class Bold extends MarkExtension {
  public readonly name = 'bold';

  get schema(): MarkSpec {
    return {
      parseDOM: [
        {
          tag: 'strong',
        },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {
          tag: 'b',
          getAttrs(node) {
            const element = Cast<HTMLElement>(node);
            return element.style.fontWeight !== 'normal' && null;
          },
        },
        {
          style: 'font-weight',
          getAttrs(value) {
            return isString(value) && /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null;
          },
        },
      ],
      toDOM: () => ['strong', 0],
    };
  }

  public keys = ({ type }: SchemaMarkTypeParams) => {
    return {
      'Mod-b': toggleMark(type),
    };
  };

  public commands({ type }: SchemaMarkTypeParams) {
    return () => {
      return toggleMark(type);
    };
  }

  public inputRules({ type }: SchemaMarkTypeParams) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)];
  }
}
