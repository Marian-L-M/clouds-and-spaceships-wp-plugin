import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const EDITOR_ID = 'cns-map-description';

interface Props {
	value: string;
	onChange: ( html: string ) => void;
}

interface TinyMceEditor {
	on( events: string, handler: () => void ): void;
	getContent(): string;
}

export default function DescriptionPanel( { value, onChange }: Props ) {
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

	return (
		<div
			className="cns-tab-panel cns-tab-panel--active"
			data-panel="description"
			role="tabpanel"
		>
			<div className="cns-desc-editor">
				<p className="description">
					{ __(
						'Description of the current map.\n Displayed underneath map element.',
						'clouds-and-spaceships'
					) }
				</p>
				<textarea id={ EDITOR_ID } rows={ 14 } defaultValue={ value } />
			</div>
		</div>
	);
}
