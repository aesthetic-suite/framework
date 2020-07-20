import React from 'react';
import { getActiveDirection } from '@aesthetic/core';
import { DirectionContextType } from './types';

export default React.createContext<DirectionContextType>(getActiveDirection() || 'ltr');
