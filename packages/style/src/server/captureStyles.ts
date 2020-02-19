import ServerRenderer from './ServerRenderer';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      AESTHETIC_SSR: ServerRenderer;
    }
  }
}

export default function captureStyles<T>(renderer: ServerRenderer, result: T): T {
  global.AESTHETIC_SSR = renderer;

  return result;
}
