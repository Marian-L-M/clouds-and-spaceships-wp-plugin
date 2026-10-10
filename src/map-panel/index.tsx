import { createRoot, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

interface StoryRef {
	id: number;
	title: string;
	status: string;
	nodeCount: number;
	editUrl: string;
}

const STATUS_LABELS: Record< string, string > = {
	publish: __( 'Published', 'clouds-and-spaceships' ),
	draft: __( 'Draft', 'clouds-and-spaceships' ),
	private: __( 'Private', 'clouds-and-spaceships' ),
};

function StoriesPanel( {
	mapId,
	overviewUrl,
}: {
	mapId: number;
	overviewUrl: string;
} ) {
	const [ stories, setStories ] = useState< StoryRef[] >( [] );
	const [ loading, setLoading ] = useState( true );

	const g = (
		window as unknown as {
			clouanspStorySuite: {
				restUrl: string;
				nonce: string;
				editorUrl: string;
			};
		}
	 ).clouanspStorySuite;

	useEffect( () => {
		( async () => {
			const res = await fetch( `${ g.restUrl }/maps/${ mapId }/stories`, {
				headers: { 'X-WP-Nonce': g.nonce },
			} );
			if ( res.ok ) setStories( await res.json() );
			setLoading( false );
		} )();
	}, [ mapId ] );

	const newStoryUrl =
		g.editorUrl +
		( g.editorUrl.includes( '?' ) ? '&' : '?' ) +
		'preset_map=' +
		mapId;

	return (
		<div className="clouansp-panel" style={ { padding: '16px' } }>
			<div
				style={ {
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 12,
				} }
			>
				<h2 style={ { margin: 0 } }>
					{ __( 'Stories on this map', 'clouds-and-spaceships' ) }
				</h2>
				<div>
					<a href={ newStoryUrl } className="button button-primary">
						{ __( '+ New Story', 'clouds-and-spaceships' ) }
					</a>{ ' ' }
					<a href={ overviewUrl } className="button">
						{ __( 'All Stories ↗', 'clouds-and-spaceships' ) }
					</a>
				</div>
			</div>

			{ loading && <p>{ __( 'Loading…', 'clouds-and-spaceships' ) }</p> }

			{ ! loading && stories.length === 0 && (
				<p className="description">
					{ __( 'No stories on this map yet.', 'clouds-and-spaceships' ) }
				</p>
			) }

			{ ! loading && stories.length > 0 && (
				<table className="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th>{ __( 'Title', 'clouds-and-spaceships' ) }</th>
							<th>{ __( 'Status', 'clouds-and-spaceships' ) }</th>
							<th>{ __( 'Nodes', 'clouds-and-spaceships' ) }</th>
							<th>{ __( 'Actions', 'clouds-and-spaceships' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ stories.map( ( s ) => (
							<tr key={ s.id }>
								<td>
									<strong>
										{ s.title ||
											__( '(no title)', 'clouds-and-spaceships' ) }
									</strong>
								</td>
								<td>{ STATUS_LABELS[ s.status ] ?? s.status }</td>
								<td>{ s.nodeCount }</td>
								<td>
									<a
										href={ s.editUrl }
										className="button button-small"
									>
										{ __( 'Edit Story', 'clouds-and-spaceships' ) }
									</a>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</div>
	);
}

// The map editor (MapEditorApp) renders the placeholder only while its Stories
// tab is open, so a new one is created each time the tab is opened. Mount into
// each new placeholder, and release the previous root once its placeholder is
// gone.
let current: {
	container: HTMLElement;
	root: ReturnType< typeof createRoot > | null;
} | null = null;

function init() {
	if ( current && ! current.container.isConnected ) {
		current.root?.unmount();
		current = null;
	}

	const container = document.getElementById( 'clouansp-map-stories-panel' );
	if ( ! container || container === current?.container ) return;
	current = { container, root: null };

	const mapId = parseInt( container.dataset.mapId || '0', 10 );
	const overviewUrl = container.dataset.overviewUrl || '#';

	if ( ! mapId ) {
		const panel = document.createElement( 'div' );
		panel.className = 'clouansp-panel';
		panel.style.padding = '16px';
		const note = document.createElement( 'p' );
		note.className = 'description';
		note.textContent = __(
			'Save the map first to manage stories.',
			'clouds-and-spaceships'
		);
		panel.appendChild( note );
		container.appendChild( panel );
		return;
	}

	current.root = createRoot( container );
	current.root.render(
		<StoriesPanel mapId={ mapId } overviewUrl={ overviewUrl } />
	);
}

// Watch for the placeholder for as long as the editor is open: it can be
// removed and re-created any number of times.
new MutationObserver( init ).observe( document.body, {
	childList: true,
	subtree: true,
} );

// Also try immediately in case the tab is already active.
init();
