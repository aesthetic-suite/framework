/* eslint-disable no-param-reassign */

import { ProcessorMap, PaddingProperty, MarginProperty, FontProperty } from './types';

export const expandedProperties: ProcessorMap = {
  font: (prop: FontProperty, onProcess) => {
    if (prop.lineHeight) {
      onProcess('lineHeight', prop.lineHeight);

      delete prop.lineHeight;
    }

    return prop.system;
  },
  margin: (prop: MarginProperty, onProcess) => {
    if (prop.topBottom) {
      onProcess('marginTop', prop.topBottom);
      onProcess('marginBottom', prop.topBottom);

      delete prop.topBottom;
    }

    if (prop.leftRight) {
      onProcess('marginLeft', prop.leftRight);
      onProcess('marginRight', prop.leftRight);

      delete prop.leftRight;
    }
  },
  padding: (prop: PaddingProperty, onProcess) => {
    if (prop.topBottom) {
      onProcess('paddingTop', prop.topBottom);
      onProcess('paddingBottom', prop.topBottom);

      delete prop.topBottom;
    }

    if (prop.leftRight) {
      onProcess('paddingLeft', prop.leftRight);
      onProcess('paddingRight', prop.leftRight);

      delete prop.leftRight;
    }
  },
};
