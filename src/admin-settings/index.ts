import './index.scss';

/**
 * Confirmation prompts for destructive links on the settings screens.
 *
 * This lived in the map editor bundle, which never loads on story pages — so
 * the story overview's delete and trash links, which carry data-confirm, fired
 * without asking. It belongs with the settings chrome, where every tab gets it.
 */
document.addEventListener( 'click', ( event ) => {
	const link = ( event.target as Element | null )?.closest?.< HTMLAnchorElement >(
		'a[data-confirm]'
	);
	if ( link && ! window.confirm( link.dataset.confirm ) ) {
		event.preventDefault();
	}
} );
