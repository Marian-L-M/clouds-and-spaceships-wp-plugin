import { useRef, useEffect } from '@wordpress/element';
import { isTypingTarget } from '../utils';

/**
 * Shared keyboard layer for the entity canvas tabs (objects / areas /
 * labels), modeled on the Labels tab behavior:
 *
 *   Ctrl/⌘+C / V      copy & paste (each panel keeps its own clipboard)
 *   Ctrl/⌘+D          duplicate the selected item
 *   Delete/Backspace  delete the selected item (panels confirm first)
 *   Arrow keys        nudge (Shift = 10 px)
 *   Tab / Shift+Tab   cycle sub-parts of the selection (e.g. area nodes);
 *                     falls through to normal focus traversal when unhandled
 *
 * Enter/Escape stay in the canvas components, where the drag state lives.
 *
 * The listener binds once per mount (panels unmount with their tab, which
 * scopes the shortcuts); handlers are read through a ref so they always see
 * the current render's props. Each handler returns true when it acted —
 * only then is the browser default suppressed, so e.g. arrow keys still
 * scroll the page while nothing is selected. Shortcuts never fire while
 * typing in a form field.
 */
export interface CanvasKeyboardHandlers {
	copy?: () => boolean;
	paste?: () => boolean;
	duplicate?: () => boolean;
	remove?: () => boolean;
	nudge?: ( dx: number, dy: number ) => boolean;
	tab?: ( backwards: boolean ) => boolean;
}

const ARROWS: Record<string, [ number, number ]> = {
	ArrowUp:    [ 0, -1 ],
	ArrowDown:  [ 0, 1 ],
	ArrowLeft:  [ -1, 0 ],
	ArrowRight: [ 1, 0 ],
};

export function useCanvasKeyboard( handlers: CanvasKeyboardHandlers ): void {
	const ref   = useRef( handlers );
	ref.current = handlers;

	useEffect( () => {
		function onKeyDown( e: KeyboardEvent ) {
			if ( isTypingTarget( e ) ) return;
			const h   = ref.current;
			const mod = e.metaKey || e.ctrlKey;
			const key = e.key.toLowerCase();

			if ( mod && key === 'c' ) {
				// Leave real text-selection copies alone.
				if ( ! window.getSelection()?.toString() ) h.copy?.();
				return;
			}
			if ( mod && key === 'v' ) {
				h.paste?.();
				return;
			}
			if ( mod && key === 'd' ) {
				if ( h.duplicate?.() ) e.preventDefault(); // browser "bookmark page"
				return;
			}
			if ( e.key === 'Delete' || e.key === 'Backspace' ) {
				if ( h.remove?.() ) e.preventDefault();
				return;
			}
			if ( e.key === 'Tab' && ! mod && ! e.altKey ) {
				if ( h.tab?.( e.shiftKey ) ) e.preventDefault();
				return;
			}
			if ( ARROWS[ e.key ] && h.nudge ) {
				const step = e.shiftKey ? 10 : 1;
				if ( h.nudge( ARROWS[ e.key ][ 0 ] * step, ARROWS[ e.key ][ 1 ] * step ) ) {
					e.preventDefault(); // page scroll
				}
			}
		}

		document.addEventListener( 'keydown', onKeyDown );
		return () => document.removeEventListener( 'keydown', onKeyDown );
	}, [] );
}

/**
 * Debounced arrow-key nudging for point-positioned entities (objects,
 * labels): the canvas updates immediately via applyLocal, and persist fires
 * once the keys go quiet so holding an arrow doesn't PATCH per pixel.
 * Create once per mount (closures must read live state, e.g. via refs) and
 * call flush() on unmount so a pending nudge isn't lost.
 */
export interface NudgeTarget {
	id: number;
	x: number;
	y: number;
}

export function createDebouncedNudge<T extends NudgeTarget>(
	getSelected: () => T | null,
	applyLocal: ( id: number, x: number, y: number ) => void,
	persist: ( id: number, x: number, y: number ) => void,
	delay = 500,
): { nudge: ( dx: number, dy: number ) => boolean; flush: () => void } {
	let timer: number | null = null;
	let pending: { id: number; x: number; y: number } | null = null;

	function flush() {
		if ( timer ) {
			window.clearTimeout( timer );
			timer = null;
		}
		const p = pending;
		pending = null;
		if ( p ) persist( p.id, p.x, p.y );
	}

	function nudge( dx: number, dy: number ): boolean {
		const item = getSelected();
		if ( ! item ) return false;
		// Switching selection mid-debounce: persist the previous item first.
		if ( pending && pending.id !== item.id ) flush();
		const base = pending ?? { id: item.id, x: item.x, y: item.y };
		const x = Math.max( 0, base.x + dx );
		const y = Math.max( 0, base.y + dy );
		pending = { id: item.id, x, y };
		applyLocal( item.id, x, y );
		if ( timer ) window.clearTimeout( timer );
		timer = window.setTimeout( flush, delay );
		return true;
	}

	return { nudge, flush };
}
