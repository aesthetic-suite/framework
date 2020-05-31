const prefixes: {
  [property: string]: {
    props?: string[];
    function?: string;
    selectors?: string[];
    values?: string[];
  };
} = {
  'background-clip-text': {
    props: ['background-clip'],
  },
  'css-appearance': {
    props: ['appearance'],
  },
  'css-backdrop-filter': {
    props: ['backdrop-filter'],
  },
  'css-boxdecorationbreak': {
    props: ['box-decoration-break'],
  },
  'css-clip-path': {
    props: ['clip-path'],
  },
  'css-color-adjust': {
    props: ['color-adjust'],
  },
  'css-cross-fade': {
    function: 'cross-fade',
    props: [
      'background',
      'background-image',
      'border-image',
      'mask',
      'list-style',
      'list-style-image',
      'content',
      'mask-image',
    ],
  },
  'css-element-function': {
    function: 'element',
    props: [
      'background',
      'background-image',
      'border-image',
      'mask',
      'list-style',
      'list-style-image',
      'content',
      'mask-image',
    ],
  },
  'css-image-set': {
    function: 'image-set',
    props: [
      'background',
      'background-image',
      'border-image',
      'cursor',
      'mask',
      'mask-image',
      'list-style',
      'list-style-image',
      'content',
    ],
  },
  'css-hyphens': {
    props: ['hyphens'],
  },
  'css-masks': {
    props: [
      'mask-border-outset',
      'mask-border-repeat',
      'mask-border-slice',
      'mask-border-source',
      'mask-border-width',
      'mask-border',
      'mask-clip',
      'mask-composite',
      'mask-image',
      'mask-origin',
      'mask-position',
      'mask-repeat',
      'mask-size',
      'mask',
    ],
  },
  'css-read-only-write': {
    selectors: [':read-only', ':read-write'],
  },
  'css-text-orientation': {
    props: ['text-orientation'],
  },
  'css-unicode-bidi': {
    props: ['unicode-bidi'],
    values: ['isolate', 'isolate-override', 'plaintext'],
  },
  'css3-tabsize': {
    props: ['tab-size'],
  },
  'font-kerning': {
    props: ['font-kerning'],
  },
  fullscreen: {
    selectors: [':fullscreen', '::backdrop'],
  },
  'intrinsic-width': {
    props: [
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'inline-size',
      'min-inline-size',
      'max-inline-size',
      'block-size',
      'min-block-size',
      'max-block-size',
      'grid',
      'grid-template',
      'grid-template-rows',
      'grid-template-columns',
      'grid-auto-columns',
      'grid-auto-rows',
    ],
    values: ['fit-content', 'fill', 'fill-available', 'stretch'],
  },
  'text-decoration': {
    props: [
      'text-decoration-style',
      'text-decoration-color',
      'text-decoration-line',
      'text-decoration',
      'text-decoration-skip',
      'text-decoration-skip-ink',
    ],
  },
  'text-emphasis': {
    props: [
      'text-emphasis',
      'text-emphasis-position',
      'text-emphasis-style',
      'text-emphasis-color',
    ],
  },
  'text-size-adjust': {
    props: ['text-size-adjust'],
  },
  'user-select-none': {
    props: ['user-select'],
  },
};

export default prefixes;
