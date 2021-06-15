import { objectLoop } from '@aesthetic/utils';
import { MixinTemplate, MixinType, Utilities } from './types';

export function hideOffscreen() {
	return {
		clipPath: 'rect(1px, 1px, 1px, 1px)',
		height: 1,
		left: '-5vw',
		overflow: 'hidden',
		position: 'fixed',
		width: 1,
	};
}

export function hideVisually() {
	return {
		'@selectors': {
			':not(:focus):not(:active)': {
				border: 0,
				clip: 'rect(0, 0, 0, 0)',
				clipPath: 'inset(50%)',
				height: 1,
				margin: 0,
				overflow: 'hidden',
				padding: 0,
				position: 'absolute',
				whiteSpace: 'nowrap',
				width: 1,
			},
		},
	};
}

export function resetButton() {
	return {
		appearance: 'none',
		backgroundColor: 'transparent',
		border: 0,
		cursor: 'pointer',
		display: 'inline-flex',
		fontSize: 'inherit',
		margin: 0,
		padding: 0,
		textDecoration: 'none',
		userSelect: 'auto',
		verticalAlign: 'middle',
	};
}

export function resetInput() {
	return {
		appearance: 'none',
		backgroundColor: 'transparent',
		margin: 0,
		padding: 0,
		width: '100%',
		'@selectors': {
			'::-moz-focus-outer': {
				border: 0,
			},
		},
	};
}

export function resetList() {
	return {
		listStyle: 'none',
		margin: 0,
		padding: 0,
	};
}

export function resetMedia() {
	return {
		display: 'block',
		verticalAlign: 'middle',
	};
}

export function resetTypography() {
	return {
		fontFamily: 'inherit',
		fontSize: 'inherit',
		fontWeight: 'normal',
		wordWrap: 'break-word',
	};
}

export function root(css: Utilities<object>) {
	const declaration = {
		backgroundColor: css.var('palette-neutral-color-00'),
		color: css.var('palette-neutral-text'),
		fontFamily: css.var('typography-font-text'),
		fontSize: css.var('typography-root-text-size'),
		lineHeight: css.var('typography-root-line-height'),
		textRendering: 'optimizeLegibility',
		textSizeAdjust: '100%',
		margin: 0,
		padding: 0,
		'-webkit-font-smoothing': 'antialiased',
		'-moz-osx-font-smoothing': 'grayscale',
		'@media': {},
	};

	// Fluid typography!
	objectLoop(css.tokens.breakpoint, (bp, size) => {
		(declaration['@media'] as Record<string, object>)[bp.query] = {
			fontSize: css.var(`breakpoint-${size}-root-text-size`),
			lineHeight: css.var(`breakpoint-${size}-root-line-height`),
		};
	});

	return declaration;
}

export function textBreak() {
	return {
		overflowWrap: 'break-word',
		wordWrap: 'break-word',
		wordBreak: 'break-word',
	};
}

export function textTruncate() {
	return {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	};
}

export function textWrap() {
	return {
		overflowWrap: 'normal',
		wordWrap: 'normal',
		wordBreak: 'normal',
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MIXIN_MAP: Record<MixinType, MixinTemplate<any>> = {
	'hide-offscreen': hideOffscreen,
	'hide-visually': hideVisually,
	'reset-button': resetButton,
	'reset-input': resetInput,
	'reset-list': resetList,
	'reset-media': resetMedia,
	'reset-typography': resetTypography,
	root,
	'text-break': textBreak,
	'text-truncate': textTruncate,
	'text-wrap': textWrap,
};
