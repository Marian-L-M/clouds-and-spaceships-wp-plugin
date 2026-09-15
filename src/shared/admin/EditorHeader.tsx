import { Button, SelectControl } from '@wordpress/components';
import { arrowLeft, external } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

export type PostStatus = 'draft' | 'publish' | 'private';

const STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
	{ value: 'draft',   label: 'Draft' },
	{ value: 'publish', label: 'Published' },
	{ value: 'private', label: 'Private' },
];

interface Props {
	pageTitle: string;
	overviewUrl: string;
	viewUrl: string;
	status: PostStatus;
	onStatusChange: ( status: PostStatus ) => void;
	isSaving: boolean;
	onSave: () => void;
	/** Label of the "back to overview" button, e.g. "All Maps". */
	backLabel: string;
	/** Label of the "view on site" button, e.g. "View Map". */
	viewLabel: string;
	/** Label of the primary save button, e.g. "Save Map". */
	saveLabel: string;
}

/**
 * Editor chrome shared by the map and story editors: back link, title, post
 * status, view link, and the save button. The three action labels are passed
 * in because they name the entity being edited; everything else is identical.
 */
export default function EditorHeader( {
	pageTitle,
	overviewUrl,
	viewUrl,
	status,
	onStatusChange,
	isSaving,
	onSave,
	backLabel,
	viewLabel,
	saveLabel,
}: Props ) {
	return (
		<div className="cns-map-editor__header">
			<Button href={ overviewUrl } variant="tertiary" icon={ arrowLeft }>
				{ backLabel }
			</Button>
			<h1>{ pageTitle }</h1>
			<div className="cns-map-editor__header-actions">
				{ viewUrl && (
					<Button
						href={ viewUrl }
						variant="secondary"
						icon={ external }
						target="_blank"
					>
						{ viewLabel }
					</Button>
				) }
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Post status', 'clouds-and-spaceships' ) }
					hideLabelFromVision
					value={ status }
					options={ STATUS_OPTIONS }
					onChange={ ( v ) => onStatusChange( v as PostStatus ) }
				/>
				<Button
					variant="primary"
					isBusy={ isSaving }
					disabled={ isSaving }
					onClick={ () => onSave() }
				>
					{ saveLabel }
				</Button>
			</div>
		</div>
	);
}
