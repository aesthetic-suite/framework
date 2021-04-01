import { transformAsync } from '@babel/core';

function transpile(code: string) {
  return transformAsync(code, {
    babelrc: false,
    configFile: false,
    filename: __filename,
    plugins: [[require.resolve('../src'), { setupPath: 'tests/setupAesthetic.ts' }]],
  });
}

describe('createComponentStyles()', () => {
  it('transforms a single property', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'inline-block',
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          display: 'inline-block'
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"c169hbqq\\"
        }
      });"
    `);
  });

  it('transforms multiple properties', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'inline-block',
    position: 'relative',
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          display: 'inline-block',
          position: 'relative'
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"c169hbqq c1et6jhk\\"
        }
      });"
    `);
  });

  it('transforms multiple elements', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'inline-block',
  },
  sibling: {
    position: 'absolute',
  },
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          display: 'inline-block'
        },
        sibling: {
          position: 'absolute'
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"c169hbqq\\"
        },
        sibling: {
          result: \\"chj83d7\\"
        }
      });"
    `);
  });

  it('returns same class name for same property', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'inline-block',
  },
  sibling: {
    display: 'inline-block',
  },
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          display: 'inline-block'
        },
        sibling: {
          display: 'inline-block'
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"c169hbqq\\"
        },
        sibling: {
          result: \\"c169hbqq\\"
        }
      });"
    `);
  });

  it('supports selectors', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles((css) => ({
  element: {
    backgroundColor: css.var('palette-brand-bg-base'),

    ':hover': {
      backgroundColor: css.var('palette-brand-bg-hovered'),
    },

    '[disabled]': {
      backgroundColor: css.var('palette-brand-bg-disabled'),
      opacity: 0.75,
    },
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(css => ({
        element: {
          backgroundColor: css.var('palette-brand-bg-base'),
          ':hover': {
            backgroundColor: css.var('palette-brand-bg-hovered')
          },
          '[disabled]': {
            backgroundColor: css.var('palette-brand-bg-disabled'),
            opacity: 0.75
          }
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"csk11b8 c35023u caksy0n c184s1x2\\"
        }
      });"
    `);
  });

  it('supports advanced selectors', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    '@selectors': {
      '> li': {
        listStyle: 'none',
      },
      '[href*="foo"]': {
        color: 'red',
      },
      ':not(:nth-child(9))': {
        display: 'hidden',
      },
      ':disabled, [disabled]': {
        opacity: 0.75,
      },
    },
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          '@selectors': {
            '> li': {
              listStyle: 'none'
            },
            '[href*=\\"foo\\"]': {
              color: 'red'
            },
            ':not(:nth-child(9))': {
              display: 'hidden'
            },
            ':disabled, [disabled]': {
              opacity: 0.75
            }
          }
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"c18e5758 cwctczp c1dh84j0 cgfq97u c184s1x2\\"
        }
      });"
    `);
  });

  it('supports media and feature queries', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles((css) => ({
  element: {
    '@media': {
      '(max-width: 600px)': {
        width: '100%',
      },
      [css.tokens.breakpoint.lg.query]: {
        width: '10rem',
      },
    },

    '@supports': {
      '(display: inline-flex)': {
        display: 'inline-flex',
      },
    },
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(css => ({
        element: {
          '@media': {
            '(max-width: 600px)': {
              width: '100%'
            },
            [css.tokens.breakpoint.lg.query]: {
              width: '10rem'
            }
          },
          '@supports': {
            '(display: inline-flex)': {
              display: 'inline-flex'
            }
          }
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"czviw19 c1caoji8 cm8buhq\\"
        }
      });"
    `);
  });

  it('supports font faces', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    fontFamily: {
      fontFamily: 'Open Sans',
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          fontFamily: {
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: 'normal',
            srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf']
          }
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"c113ikk6\\"
        }
      });"
    `);
  });

  it('supports keyframes', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    animationName: {
      from: { transform: 'scaleX(0)' },
      to: { transform: 'scaleX(1)' },
    },
    animationDuration: '3s',
    animationTimingFunction: 'ease-in',
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          animationName: {
            from: {
              transform: 'scaleX(0)'
            },
            to: {
              transform: 'scaleX(1)'
            }
          },
          animationDuration: '3s',
          animationTimingFunction: 'ease-in'
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"cgfm18 cqdzva8 c128h89l\\"
        }
      });"
    `);
  });

  it('supports fallbacks', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'inline-flex',

    '@fallbacks': {
      display: ['inline', 'inline-block'],
    },
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          display: 'inline-flex',
          '@fallbacks': {
            display: ['inline', 'inline-block']
          }
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          result: \\"ceq1ljg\\"
        }
      });"
    `);
  });

  it('supports variants', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles((css) => ({
  element: {
    '@variants': {
      size: {
        sm: { fontSize: css.var('text-sm-size') },
        df: { fontSize: css.var('text-df-size') },
        lg: { fontSize: css.var('text-lg-size') },
      },

      palette: {
        brand: { backgroundColor: css.var('palette-brand-bg-base') },
        success: { backgroundColor: css.var('palette-success-bg-base') },
        warning: { backgroundColor: css.var('palette-warning-bg-base') },
      },
    },
  }
}));`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(css => ({
        element: {
          '@variants': {
            size: {
              sm: {
                fontSize: css.var('text-sm-size')
              },
              df: {
                fontSize: css.var('text-df-size')
              },
              lg: {
                fontSize: css.var('text-lg-size')
              }
            },
            palette: {
              brand: {
                backgroundColor: css.var('palette-brand-bg-base')
              },
              success: {
                backgroundColor: css.var('palette-success-bg-base')
              },
              warning: {
                backgroundColor: css.var('palette-warning-bg-base')
              }
            }
          }
        }
      }));
      renderComponentStyles(styleSheet, {
        element: {
          variants: {
            size_sm: \\"c1qx7d18\\",
            size_df: \\"cpfxegw\\",
            size_lg: \\"ckfuq95\\",
            palette_brand: \\"csk11b8\\",
            palette_success: \\"czb93oc\\",
            palette_warning: \\"c3x9w2d\\"
          },
          variantTypes: new Set([\\"size\\", \\"palette\\"])
        }
      });"
    `);
  });

  describe('style sheet variants', () => {
    it('works with color scheme chained', async () => {
      const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'block',
    color: 'gray',
  },
}))
  .addColorSchemeVariant('light', () => ({
    element: {
      backgroundColor: 'white',
      color: 'black',
    },
  }))
  .addColorSchemeVariant('dark', () => ({
    element: {
      backgroundColor: 'black',
      color: 'white',
    },
  }));`);

      expect(result?.code).toMatchInlineSnapshot(`
        "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
        const styleSheet = createComponentStyles(() => ({
          element: {
            display: 'block',
            color: 'gray'
          }
        })).addColorSchemeVariant('light', () => ({
          element: {
            backgroundColor: 'white',
            color: 'black'
          }
        })).addColorSchemeVariant('dark', () => ({
          element: {
            backgroundColor: 'black',
            color: 'white'
          }
        }));
        renderComponentStyles(styleSheet, {
          element: {
            result: \\"c1s7hmty cddrzz3 c13fy9i4\\"
          }
        });"
      `);
    });

    it('works with contrast level chained', async () => {
      const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'block',
    color: 'orange',
  },
}))
  .addContrastVariant('low', () => ({
    element: {
      color: 'red',
    },
  }))
  .addContrastVariant('high', () => ({
    element: {
      color: 'yellow',
    },
  }));`);

      expect(result?.code).toMatchInlineSnapshot(`
        "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
        const styleSheet = createComponentStyles(() => ({
          element: {
            display: 'block',
            color: 'orange'
          }
        })).addContrastVariant('low', () => ({
          element: {
            color: 'red'
          }
        })).addContrastVariant('high', () => ({
          element: {
            color: 'yellow'
          }
        }));
        renderComponentStyles(styleSheet, {
          element: {
            result: \\"c1s7hmty c3s35ig\\"
          }
        });"
      `);
    });

    it('works with theme chained', async () => {
      const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'block',
    color: 'gray',
  },
}))
  .addThemeVariant('night', () => ({
    element: {
      color: 'blue',
    },
  }))
  .addThemeVariant('twilight', () => ({
    element: {
      color: 'purple',
    },
  }));`);

      expect(result?.code).toMatchInlineSnapshot(`
        "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
        const styleSheet = createComponentStyles(() => ({
          element: {
            display: 'block',
            color: 'gray'
          }
        })).addThemeVariant('night', () => ({
          element: {
            color: 'blue'
          }
        })).addThemeVariant('twilight', () => ({
          element: {
            color: 'purple'
          }
        }));
        renderComponentStyles(styleSheet, {
          element: {
            result: \\"c1s7hmty cmqamj9\\"
          }
        });"
      `);
    });

    it('works with theme and applies if current theme matches', async () => {
      const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'block',
    color: 'gray',
  },
}))
  .addThemeVariant('light', () => ({
    element: {
      color: 'blue',
    },
  }));`);

      expect(result?.code).toMatchInlineSnapshot(`
        "import { createComponentStyles, renderComponentStyles } from '@aesthetic/local';
        const styleSheet = createComponentStyles(() => ({
          element: {
            display: 'block',
            color: 'gray'
          }
        })).addThemeVariant('light', () => ({
          element: {
            color: 'blue'
          }
        }));
        renderComponentStyles(styleSheet, {
          element: {
            result: \\"c1s7hmty ct2jx0m\\"
          }
        });"
      `);
    });
  });
});
