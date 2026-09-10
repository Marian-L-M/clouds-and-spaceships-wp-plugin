/**
 * Glossary inline format.
 *
 * Adds a "Glossary term" button to the rich-text toolbar (More menu). Editors
 * highlight text, pick a glossary entry from a searchable list, and the text
 * becomes a link to the entry's definition page:
 *
 *   <a class="cns-glossary-term" href="…" data-glossary-id="123">term</a>
 *
 * Only the entry ID is authoritative — the href and the hover tooltip are
 * refreshed server-side on render (see glossary/setup.php), so definitions
 * never go stale.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	registerFormatType,
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import {
	Popover,
	ComboboxControl,
	Button,
	Spinner,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { termDescription } from '@wordpress/icons';
import { decodeEntities } from '@wordpress/html-entities';

const FORMAT_NAME = 'cns-wiki-suite/glossary';

function GlossaryPicker( { value, onChange, onClose, contentRef, settings } ) {
	const activeFormat = getActiveFormat( value, FORMAT_NAME );
	const activeId = activeFormat?.attributes?.glossaryId ?? '';

	const [ search, setSearch ] = useState( '' );

	const anchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	const { entries, isResolving } = useSelect(
		( select ) => {
			const query = {
				per_page: 20,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
				search,
				_fields: 'id,title,link',
			};
			return {
				entries:
					select( coreStore ).getEntityRecords(
						'postType',
						'glossary',
						query
					) ?? [],
				isResolving: select( coreStore ).isResolving(
					'getEntityRecords',
					[ 'postType', 'glossary', query ]
				),
			};
		},
		[ search ]
	);

	const options = entries.map( ( entry ) => ( {
		value: String( entry.id ),
		label: decodeEntities( entry.title?.rendered ?? '' ),
	} ) );

	const applyEntry = ( entryId ) => {
		const entry = entries.find( ( e ) => String( e.id ) === entryId );
		if ( ! entry ) {
			return;
		}
		onChange(
			applyFormat( value, {
				type: FORMAT_NAME,
				attributes: {
					url: entry.link,
					glossaryId: String( entry.id ),
				},
			} )
		);
		onClose();
	};

	return (
		<Popover
			anchor={ anchor }
			onClose={ onClose }
			placement="bottom"
			shift
			focusOnMount="firstElement"
			className="cns-glossary-popover"
		>
			<div style={ { padding: '16px', minWidth: '260px' } }>
				<ComboboxControl
					label={ __( 'Glossary entry', 'clouds-and-spaceships' ) }
					value={ activeId }
					options={ options }
					onChange={ applyEntry }
					onFilterValueChange={ setSearch }
					help={
						isResolving ? (
							<Spinner />
						) : (
							__(
								'Search by title. The tooltip shows the entry’s definition.',
								'clouds-and-spaceships'
							)
						)
					}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
				{ !! activeFormat && (
					<Flex justify="flex-end" style={ { marginTop: '12px' } }>
						<FlexItem>
							<Button
								variant="tertiary"
								isDestructive
								onClick={ () => {
									onChange(
										removeFormat( value, FORMAT_NAME )
									);
									onClose();
								} }
							>
								{ __( 'Remove glossary term', 'clouds-and-spaceships' ) }
							</Button>
						</FlexItem>
					</Flex>
				) }
			</div>
		</Popover>
	);
}

function GlossaryEdit( { isActive, value, onChange, contentRef } ) {
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );

	return (
		<>
			<RichTextToolbarButton
				icon={ termDescription }
				title={ __( 'Glossary term', 'clouds-and-spaceships' ) }
				isActive={ isActive }
				onClick={ () => setIsPickerOpen( ( open ) => ! open ) }
			/>
			{ isPickerOpen && (
				<GlossaryPicker
					value={ value }
					onChange={ onChange }
					onClose={ () => setIsPickerOpen( false ) }
					contentRef={ contentRef }
					settings={ glossaryFormat }
				/>
			) }
		</>
	);
}

const glossaryFormat = {
	title: __( 'Glossary term', 'clouds-and-spaceships' ),
	tagName: 'a',
	className: 'cns-glossary-term',
	attributes: {
		url: 'href',
		glossaryId: 'data-glossary-id',
	},
	edit: GlossaryEdit,
};

registerFormatType( FORMAT_NAME, glossaryFormat );
