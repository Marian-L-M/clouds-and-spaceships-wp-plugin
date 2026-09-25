declare module '*.scss' {
	const content: Record<string, string>;
	export default content;
}

// @wordpress/block-editor ships no type declarations.
declare module '@wordpress/block-editor';
