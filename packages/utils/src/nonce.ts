/* eslint-disable no-underscore-dangle */

declare const __webpack_nonce__: string;

export default function nonce(): string | undefined {
	return typeof __webpack_nonce__ === 'undefined' ? undefined : __webpack_nonce__;
}
