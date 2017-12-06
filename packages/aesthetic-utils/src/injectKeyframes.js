/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { Keyframe, StyleDeclaration } from '../../types';

type InjectKeyframesOptions = {
  join?: boolean,
};

export default function injectKeyframes(
  properties: StyleDeclaration,
  keyframes: { [animationName: string]: string | Keyframe },
  options?: InjectKeyframesOptions = {},
) {
  if (!properties.animationName) {
    return;
  }

  const value = String(properties.animationName).split(',').map((name) => {
    const animationName = name.trim();

    return keyframes[animationName] || animationName;
  });

  if (options.join) {
    properties.animationName = value.join(', ');
  } else {
    // $FlowIgnore Hard to resolve this type
    properties.animationName = value;
  }
}
