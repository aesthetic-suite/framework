import { expect } from 'chai';
import { create } from 'jss';
import preset from 'jss-preset-default';
import JSSAdapter from '../src/JSSAdapter';

describe('JSSAdapter', () => {
  const style = createStyleTag('jss');
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAdapter(jss, { element: style });
    style.textContent = '';
  });

  it('can customize the JSS instance through the constructor', () => {
    const jss = create();
    instance = new JSSAdapter(jss);

    expect(instance.jss).to.equal(jss);
  });

  it('transforms style declarations into class names', (done) => {
    expect(instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
      buttonGroup: {
        display: 'flex',
      },
    })).to.deep.equal({
      button: 'button-1157032238',
      buttonGroup: 'buttonGroup-4078521147',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(`
.button-1157032238 {
  display: inline-block;
  padding: 5px;
}
.buttonGroup-4078521147 {
  display: flex;
}
`);
      done();
    }, 0);
  });

  it.skip('handles an array of style declarations', () => {
    // JSS does not support this
  });

  it('supports pseudos', (done) => {
    expect(instance.transform('foo', {
      foo: {
        position: 'fixed',
        '&:hover': {
          position: 'static',
        },
        '&::before': {
          position: 'absolute',
        },
      },
    })).to.deep.equal({
      '.foo-3861871145::before': '.foo-3861871145::before-2055941493',
      '.foo-3861871145:hover': '.foo-3861871145:hover-3881610462',
      foo: 'foo-3861871145',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(`
.foo-3861871145 {
  position: fixed;
}
.foo-3861871145:hover {
  position: static;
}
.foo-3861871145::before {
  position: absolute;
}
`);
      done();
    }, 0);
  });

  it('supports font faces', (done) => {
    const font = {
      fontFamily: 'FontName',
      fontStyle: 'normal',
      fontWeight: 'normal',
      src: "url('coolfont.woff2') format('woff2')",
    };

    expect(instance.transform('foo', {
      '@font-face': font,
      foo: {
        fontFamily: 'FontName',
        fontSize: 20,
      },
    })).to.deep.equal({
      foo: 'foo-1066392687',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(`
@font-face {
  font-family: FontName;
  font-style: normal;
  font-weight: normal;
  src: url('coolfont.woff2') format('woff2');
}
.foo-1066392687 {
  font-size: 20px;
  font-family: FontName;
}
`);
      done();
    }, 0);
  });

  it('supports animations', (done) => {
    const translateKeyframes = {
      '0%': { transform: 'translateX(0)' },
      '50%': { transform: 'translateX(100px)' },
      '100%': { transform: 'translateX(0)' },
    };

    const opacityKeyframes = {
      from: { opacity: 0 },
      to: { opacity: 1 },
    };

    expect(instance.transform('foo', {
      '@keyframes translate-anim': translateKeyframes,
      '@keyframes opacity-anim': opacityKeyframes,
      foo: {
        animationName: 'translate-anim opacity-anim',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    })).to.deep.equal({
      foo: 'foo-4066947442',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(`
@keyframes translate-anim {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes opacity-anim {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.foo-4066947442 {
  animation-name: translate-anim opacity-anim;
  animation-duration: 3s, 1200ms;
  animation-iteration-count: infinite;
}
`);
      done();
    }, 0);
  });

  it('supports media queries', (done) => {
    expect(instance.transform('foo', {
      foo: {
        color: 'red',
      },
      '@media(min-width: 300px)': {
        foo: {
          color: 'blue',
        },
      },
    })).to.deep.equal({
      foo: 'foo-3645560457',
    });

    setTimeout(() => {
      expect(style.textContent).to.equal(`
.foo-3645560457 {
  color: red;
}
@media(min-width: 300px) {
  .foo-3645560457 {
    color: blue;
  }
}
`);
      done();
    }, 0);
  });
});
