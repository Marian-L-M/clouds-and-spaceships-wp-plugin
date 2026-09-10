interface Props< T extends string > {
	tabs: { id: T; label: string }[];
	activeTab: T;
	onChange: ( tab: T ) => void;
	/** Accessible name for the tab list, e.g. "Story editor modes". */
	ariaLabel: string;
}

/**
 * Tab strip shared by the map and story editors. Which tabs exist — and, for
 * the map editor, which ones are visible for the current map — is decided by
 * the caller; this only renders the list it is given.
 */
export default function TabBar< T extends string >( {
	tabs,
	activeTab,
	onChange,
	ariaLabel,
}: Props< T > ) {
	return (
		<nav
			className="cns-map-editor__tabs"
			role="tablist"
			aria-label={ ariaLabel }
		>
			{ tabs.map( ( t ) => (
				<button
					key={ t.id }
					className={ `cns-tab${ activeTab === t.id ? ' cns-tab--active' : '' }` }
					role="tab"
					aria-selected={ activeTab === t.id }
					onClick={ () => onChange( t.id ) }
				>
					{ t.label }
				</button>
			) ) }
		</nav>
	);
}
