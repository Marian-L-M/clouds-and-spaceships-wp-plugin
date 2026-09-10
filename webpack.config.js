/**
 * Extends the default @wordpress/scripts config with the plugin's non-block
 * entry points. Blocks under src/blocks/ are auto-discovered and emitted to
 * build/blocks/ via --blocks-manifest.
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const configs = Array.isArray( defaultConfig ) ? defaultConfig : [ defaultConfig ];
const [ scriptConfig, ...rest ] = configs;

const withEntries = {
	...scriptConfig,
	entry: async () => {
		// defaultConfig.entry is a function in wp-scripts v26+; call it to get
		// the auto-detected block entry points, then merge in ours.
		const blockEntries =
			typeof scriptConfig.entry === 'function'
				? await scriptConfig.entry()
				: scriptConfig.entry;

		return {
			...blockEntries,
			'map-admin/index': './src/map/admin/index.tsx',
			'story-admin/index': './src/story/admin/index.tsx',
			'map-panel/index': './src/map-panel/index.tsx',
			'formats/glossary': './src/formats/glossary/index.js',
			'toast/index': './src/toast/index.ts',
		};
	},
};

module.exports = Array.isArray( defaultConfig )
	? [ withEntries, ...rest ]
	: withEntries;
