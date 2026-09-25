/**
 * Visitor-facing show/hide buttons for a map's areas, objects and labels.
 *
 * Used by the map block and by the story block for its base map. The author's
 * saved choice is the starting state; a visitor's change lasts for the page
 * view only and is never written back.
 *
 * `layers` is mutated in place, so the caller's draw function reads the current
 * state without any wiring beyond the `onChange` repaint.
 */

const LAYERS = [
	[ 'areas', 'Areas' ],
	[ 'objects', 'Objects' ],
	[ 'labels', 'Labels' ],
];

/**
 * @param {Object}   opts
 * @param {Element}  opts.container Element the button group is appended to.
 *                                  Must sit outside any scroll container, so
 *                                  the buttons stay put while a zoomed canvas
 *                                  pans.
 * @param {string}   opts.className Block class for the group, e.g.
 *                                  'cns-map-layers'. Buttons get `__btn`.
 * @param {Object}   opts.present   Which layers the map actually has content
 *                                  in; a layer that is empty gets no button.
 * @param {Object}   opts.layers    Live visibility state, mutated on click.
 * @param {Function} opts.onChange  Called after each toggle, to repaint.
 */
export function setupLayerToggles( { container, className, present, layers, onChange } ) {
	if ( ! container ) return;
	if ( ! LAYERS.some( ( [ key ] ) => present[ key ] ) ) return;

	const box = document.createElement( 'div' );
	box.className = className;
	box.setAttribute( 'role', 'group' );
	box.setAttribute( 'aria-label', 'Map layers' );

	LAYERS.forEach( function ( [ key, label ] ) {
		if ( ! present[ key ] ) return;

		const btn = document.createElement( 'button' );
		btn.type = 'button';
		btn.className = className + '__btn';
		btn.textContent = label;

		const sync = function () {
			btn.classList.toggle( 'is-off', ! layers[ key ] );
			btn.setAttribute( 'aria-pressed', layers[ key ] ? 'true' : 'false' );
		};
		btn.addEventListener( 'click', function () {
			layers[ key ] = ! layers[ key ];
			sync();
			onChange();
		} );
		sync();
		box.appendChild( btn );
	} );

	container.appendChild( box );
}
