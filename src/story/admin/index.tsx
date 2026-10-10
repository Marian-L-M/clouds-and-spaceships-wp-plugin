import { createRoot } from '@wordpress/element';
import './admin.scss';
import StoryEditorApp from './app/StoryEditorApp';

const root = document.getElementById( 'clouansp-admin-root' );
if ( root ) {
	createRoot( root ).render( <StoryEditorApp /> );
}
