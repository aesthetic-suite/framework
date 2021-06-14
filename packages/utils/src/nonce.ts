/* eslint-disable camelcase, no-underscore-dangle */

declare const __webpack_nonce__: string;

export function nonce(): string | undefined {
	return typeof __webpack_nonce__ === 'undefined' ? undefined : __webpack_nonce__;
}
