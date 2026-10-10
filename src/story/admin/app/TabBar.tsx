import { __ } from '@wordpress/i18n';
import SharedTabBar from '../../../shared/admin/TabBar';
import type { StoryTab } from '../../types';

const TABS: { id: StoryTab; label: string }[] = [
	{ id: 'settings', label: __( 'Settings', 'clouds-and-spaceships' ) },
	{ id: 'canvas',   label: __( 'Canvas', 'clouds-and-spaceships' ) },
	{ id: 'nodes',    label: __( 'Nodes', 'clouds-and-spaceships' ) },
	{ id: 'paths',    label: __( 'Paths', 'clouds-and-spaceships' ) },
];

interface Props {
	activeTab: StoryTab;
	onChange: ( tab: StoryTab ) => void;
}

export default function TabBar( { activeTab, onChange }: Props ) {
	return (
		<SharedTabBar
			tabs={ TABS }
			activeTab={ activeTab }
			onChange={ onChange }
			ariaLabel={ __( 'Story editor modes', 'clouds-and-spaceships' ) }
		/>
	);
}
