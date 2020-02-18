import ServerRenderer from './ServerRenderer';

export default function captureStyles<T>(renderer: ServerRenderer, result: T): T {
  // @ts-ignore
  global.AESTHETIC_SSR = renderer;

  return result;
}
