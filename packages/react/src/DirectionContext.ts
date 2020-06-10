import React from 'react';
import { Direction } from '@aesthetic/types';
import { isSSR } from '@aesthetic/utils';
import { DirectionContextType } from './types';

let direction = 'ltr';

if (!isSSR()) {
  direction =
    document.documentElement?.getAttribute('dir') || document.body?.getAttribute('dir') || 'ltr';
}

export default React.createContext<DirectionContextType>(direction as Direction);
