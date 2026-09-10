import { useState } from '@wordpress/element';
import { Button, SearchControl, SelectControl } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { mapApiFetch } from '../../utils';
import type { StoryLink, LinkType } from '../../../types';

interface LinkableItem {
	id:    number;
	title: string;
	type:  LinkType;
}

interface Props {
	storyId:      number;
	links:        StoryLink[];
	onLinkAdd:    ( linkType: string, linkId: number ) => void;
	onLinkDelete: ( linkId: number ) => void;
}

const LINK_TYPE_LABELS: Record< LinkType, string > = {
	map_object: 'Map Object',
	map_area:   'Map Area',
	hierarchy:  'Hierarchy Region',
};

export default function LinksPanel( { storyId: _storyId, links, onLinkAdd, onLinkDelete }: Props ) {
	const [ search,   setSearch   ] = useState( '' );
	const [ results,  setResults  ] = useState< LinkableItem[] >( [] );
	const [ loading,  setLoading  ] = useState( false );
	const [ linkType, setLinkType ] = useState< LinkType >( 'map_object' );

	async function handleSearch() {
		setLoading( true );
		try {
			// Query map-suite's REST API for linkable entities.
			let path = '';
			if ( linkType === 'map_object' ) {
				path = '/objects?per_page=50&search=' + encodeURIComponent( search );
			} else if ( linkType === 'map_area' ) {
				path = '/areas?per_page=50&search=' + encodeURIComponent( search );
			} else {
				path = '/hierarchy?per_page=50&search=' + encodeURIComponent( search );
			}
			const data = await mapApiFetch< Array< { id: number; title: string } > >( 'GET', path );
			setResults( data.map( ( item ) => ( { id: item.id, title: item.title, type: linkType } ) ) );
		} catch {
			/* search failures leave the results empty, as before */
		} finally {
			setLoading( false );
		}
	}

	const linkedIds = new Set( links.filter( ( l ) => l.linkType === linkType ).map( ( l ) => l.linkId ) );

	return (
		<div className="cns-panel cns-links-panel">
			<h2>{ __( 'Map Suite Links', 'clouds-and-spaceships' ) }</h2>
			<p className="description">
				{ __(
					'Link this story to specific map objects, areas, or hierarchy regions. These relationships are used for cross-referencing in the map editor.',
					'clouds-and-spaceships'
				) }
			</p>

			{ links.length > 0 && (
				<>
					<h3>{ __( 'Linked Entities', 'clouds-and-spaceships' ) }</h3>
					<table className="wp-list-table widefat fixed striped">
						<thead>
							<tr>
								<th>{ __( 'Type', 'clouds-and-spaceships' ) }</th>
								<th>{ __( 'Entity', 'clouds-and-spaceships' ) }</th>
								<th>{ __( 'Actions', 'clouds-and-spaceships' ) }</th>
							</tr>
						</thead>
						<tbody>
							{ links.map( ( storyLink ) => (
								<tr key={ storyLink.id }>
									<td><span className="cns-badge">{ LINK_TYPE_LABELS[ storyLink.linkType ] }</span></td>
									<td>{ storyLink.linkTitle || `#${ storyLink.linkId }` }</td>
									<td>
										<Button
											size="small"
											icon={ linkOff }
											isDestructive
											onClick={ () => onLinkDelete( storyLink.id ) }
										>
											{ __( 'Unlink', 'clouds-and-spaceships' ) }
										</Button>
									</td>
								</tr>
							) ) }
						</tbody>
					</table>
				</>
			) }

			<h3 style={ { marginTop: 24 } }>{ __( 'Add Link', 'clouds-and-spaceships' ) }</h3>
			<div className="cns-row-group">
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Entity type', 'clouds-and-spaceships' ) }
					hideLabelFromVision
					value={ linkType }
					options={ [
						{ value: 'map_object', label: __( 'Map Object', 'clouds-and-spaceships' ) },
						{ value: 'map_area',   label: __( 'Map Area', 'clouds-and-spaceships' ) },
						{ value: 'hierarchy',  label: __( 'Hierarchy Region', 'clouds-and-spaceships' ) },
					] }
					onChange={ ( v ) => { setLinkType( v as LinkType ); setResults( [] ); } }
				/>
				<SearchControl
					__nextHasNoMarginBottom
					label={ __( 'Search entities', 'clouds-and-spaceships' ) }
					hideLabelFromVision
					placeholder={ __( 'Search…', 'clouds-and-spaceships' ) }
					value={ search }
					onChange={ setSearch }
					onKeyDown={ ( e: React.KeyboardEvent ) => {
						if ( e.key === 'Enter' ) handleSearch();
					} }
				/>
				<Button
					variant="secondary"
					isBusy={ loading }
					disabled={ loading }
					onClick={ handleSearch }
				>
					{ loading
						? __( 'Searching…', 'clouds-and-spaceships' )
						: __( 'Search', 'clouds-and-spaceships' ) }
				</Button>
			</div>

			{ results.length > 0 && (
				<ul className="cns-link-results">
					{ results.map( ( item ) => (
						<li key={ item.id } className="cns-link-result">
							<span>{ item.title || `#${ item.id }` }</span>
							{ linkedIds.has( item.id ) ? (
								<span className="cns-badge">{ __( 'Linked', 'clouds-and-spaceships' ) }</span>
							) : (
								<Button
									size="small"
									variant="primary"
									icon={ link }
									onClick={ () => onLinkAdd( linkType, item.id ) }
								>
									{ __( 'Link', 'clouds-and-spaceships' ) }
								</Button>
							) }
						</li>
					) ) }
				</ul>
			) }
		</div>
	);
}
