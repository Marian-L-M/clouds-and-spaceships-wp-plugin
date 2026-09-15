import { useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { TinyMceEditor } from '../../../types';

const EDITOR_ID = 'cns-map-description';

interface Props {
	value: string;
	onChange: ( html: string ) => void;
	/** Stock post editor URL; the hand-off button is hidden when empty. */
	wpEditUrl: string;
	isSaving: boolean;
	/**
	 * Saves the map and leaves for the WordPress editor. The latest TinyMCE
	 * content is passed along because the parent's state may still be a
	 * keystroke behind when the button is clicked.
	 */
	onEditInWordPress: ( description: string ) => void;
}

export default function DescriptionPanel( {
	value,
	onChange,
	wpEditUrl,
	isSaving,
	onEditInWordPress,
}: Props ) {
	const onChangeRef = useRef( onChange );
	onChangeRef.current = onChange;

	useEffect( () => {
		const ed = window.wp?.oldEditor || window.wp?.editor;
		const textarea = document.getElementById(
			EDITOR_ID
		) as HTMLTextAreaElement | null;

		// Text-mode (Quicktags) edits land directly in the textarea.
		const onInput = () => onChangeRef.current( textarea?.value ?? '' );
		textarea?.addEventListener( 'input', onInput );

		if ( ed?.initialize ) {
			ed.initialize( EDITOR_ID, {
				tinymce: {
					wpautop: true,
					height: 320,
					toolbar1:
						'formatselect,bold,italic,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,undo,redo',
					setup( editor: TinyMceEditor ) {
						editor.on( 'change keyup input Undo Redo', () => {
							onChangeRef.current( editor.getContent() );
						} );
					},
				},
				quicktags: true,
				mediaButtons: true,
			} );
		}

		return () => {
			textarea?.removeEventListener( 'input', onInput );
			ed?.remove?.( EDITOR_ID );
		};
	}, [] );

	/** Current editor content, from whichever mode is active. */
	function readDescription(): string {
		const editor = window.tinymce?.get( EDITOR_ID );
		if ( editor && ! editor.isHidden() ) {
			return editor.getContent();
		}
		const textarea = document.getElementById(
			EDITOR_ID
		) as HTMLTextAreaElement | null;
		return textarea?.value ?? value;
	}

	return (
		<div
			className="cns-tab-panel cns-tab-panel--active"
			data-panel="description"
			role="tabpanel"
		>
			<div className="cns-desc-editor">
				<div className="cns-desc-editor__header">
					<p className="description">
						{ __(
							'Description of the current map.\n Displayed underneath map element.',
							'clouds-and-spaceships'
						) }
					</p>
					{ wpEditUrl && (
						<Button
							variant="secondary"
							isBusy={ isSaving }
							disabled={ isSaving }
							onClick={ () =>
								onEditInWordPress( readDescription() )
							}
						>
							{ __(
								'Edit in WordPress editor',
								'clouds-and-spaceships'
							) }
						</Button>
					) }
				</div>
				<textarea id={ EDITOR_ID } rows={ 14 } defaultValue={ value } />
			</div>
		</div>
	);
}
