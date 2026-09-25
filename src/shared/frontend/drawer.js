/**
 * The infobox side drawer, shared by the map block and the story block.
 *
 * One element (`#cns-map-drawer`) serves every block on the page, whichever
 * block created it — both suites already relied on that, each with its own copy
 * of the builder. The shell lives here; each block still composes its own body
 * HTML, because a map item and a story's map item resolve different fields.
 *
 * Visibility is a class toggle rather than the `hidden` attribute, so an
 * author's `display: flex/block` never fights the UA's `[hidden]` rule.
 */

const DRAWER_ID = 'cns-map-drawer';
const BODY_OPEN_CLASS = 'cns-map-drawer-open';

/** Attaches the delegated body handler once, whoever supplies it first. */
function attachBodyClick( drawer, handler ) {
	if ( ! handler || drawer.dataset.cnsBodyClick === '1' ) return;
	drawer.querySelector( '.cns-map-drawer__body' ).addEventListener( 'click', handler );
	drawer.dataset.cnsBodyClick = '1';
}

/** Escapes text for interpolation into a drawer HTML string. */
export function escHtml( str ) {
	return String( str )
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		.replace( /"/g, '&quot;' );
}

export function closeDrawer() {
	const drawer = document.getElementById( DRAWER_ID );
	if ( ! drawer ) return;
	drawer.classList.remove( 'is-open' );
	document.body.classList.remove( BODY_OPEN_CLASS );
}

/** True while the drawer is on screen — used to decide what Escape closes. */
export function isDrawerOpen() {
	const drawer = document.getElementById( DRAWER_ID );
	return !! drawer && drawer.classList.contains( 'is-open' );
}

/**
 * Returns the shared drawer, building it on first use.
 *
 * A body-click handler is attached the first time one is supplied rather than
 * only when the element is built: a story block on the same page may create the
 * drawer first without one, and the map block still needs its collapsible
 * infoboxes to work.
 */
function getOrCreateDrawer( onBodyClick ) {
	let drawer = document.getElementById( DRAWER_ID );
	if ( drawer ) {
		attachBodyClick( drawer, onBodyClick );
		return drawer;
	}

	drawer = document.createElement( 'div' );
	drawer.id = DRAWER_ID;
	drawer.className = 'cns-map-drawer';
	drawer.setAttribute( 'role', 'dialog' );
	drawer.setAttribute( 'aria-modal', 'true' );
	drawer.innerHTML =
		'<div class="cns-map-drawer__backdrop"></div>' +
		'<div class="cns-map-drawer__panel">' +
			'<div class="cns-map-drawer__header">' +
				'<button class="cns-map-drawer__close" aria-label="Close">&times;</button>' +
			'</div>' +
			'<div class="cns-map-drawer__body"></div>' +
		'</div>';
	document.body.appendChild( drawer );

	drawer.querySelector( '.cns-map-drawer__backdrop' ).addEventListener( 'click', closeDrawer );
	drawer.querySelector( '.cns-map-drawer__close' ).addEventListener( 'click', closeDrawer );
	attachBodyClick( drawer, onBodyClick );
	document.addEventListener( 'keydown', function ( e ) {
		if ( e.key === 'Escape' ) closeDrawer();
	} );

	return drawer;
}

/**
 * Fills the drawer with `html` and opens it, moving focus to the close button.
 */
export function showDrawer( html, onBodyClick ) {
	const drawer = getOrCreateDrawer( onBodyClick );
	drawer.querySelector( '.cns-map-drawer__body' ).innerHTML = html;
	drawer.classList.add( 'is-open' );
	document.body.classList.add( BODY_OPEN_CLASS );
	drawer.querySelector( '.cns-map-drawer__close' ).focus();
}
