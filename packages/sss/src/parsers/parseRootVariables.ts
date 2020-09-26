import { Variables } from '@aesthetic/types';
import { ParserOptions } from '../types';
import parseVariables from './parseVariables';

export default function parseRootVariables<T extends object>(
  variables: Variables,
  options: ParserOptions<T>,
) {
  parseVariables(null, variables, options);
}
