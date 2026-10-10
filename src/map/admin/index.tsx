import { createRoot } from '@wordpress/element';
import MapEditorApp   from './app/MapEditorApp';
import IconLibraryApp from './app/IconLibraryApp';
import './admin.scss';

document.addEventListener( 'DOMContentLoaded', () => {
	const editorEl = document.getElementById( 'clouansp-admin-root' );
	if ( editorEl ) createRoot( editorEl ).render( <MapEditorApp /> );

	const iconsEl = document.getElementById( 'clouansp-icons-root' );
	if ( iconsEl ) createRoot( iconsEl ).render( <IconLibraryApp /> );

	document.body.addEventListener( 'click', ( e ) => {
		const link = ( e.target as Element ).closest<HTMLAnchorElement>( 'a[data-confirm]' );
		if ( link && ! window.confirm( link.dataset.confirm ) ) {
			e.preventDefault();
		}
	} );
} );
