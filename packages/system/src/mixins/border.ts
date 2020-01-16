import { DeclarationBlock } from '@aesthetic/sss';
import { BorderToken } from '../types';

// TODO color
export function border({ width, radius }: BorderToken): DeclarationBlock {
  return {
    borderColor: '#000',
    borderRadius: radius,
    borderStyle: 'solid',
    borderWidth: width,
  };
}
