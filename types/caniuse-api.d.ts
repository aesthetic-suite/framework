declare module 'caniuse-api' {
  export function find(query: string): string[];

  export function getBrowserScope(): string[];

  export function getLatestStableBrowsers(): string[];

  export function getSupport(feature: string): {
    [browser: string]: { y?: number; n?: number; a?: number; x?: number };
  };

  export function setBrowserScope(scope: string): void;
}
