import { __ } from '@wordpress/i18n';
import SharedTabBar from '../../../shared/admin/TabBar';
import type { StoryTab } from '../../types';

const TABS: { id: StoryTab; label: string }[] = [
	{ id: 'settings', label: 'Settings' },
	{ id: 'canvas',   label: 'Canvas'   },
	{ id: 'nodes',    label: 'Nodes'    },
	{ id: 'paths',    label: 'Paths'    },
	{ id: 'links',    label: 'Links'    },
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
