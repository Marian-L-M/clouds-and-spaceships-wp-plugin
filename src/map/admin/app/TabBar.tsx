import { __ } from '@wordpress/i18n';
import SharedTabBar from '../../../shared/admin/TabBar';
import type { Tab } from '../../types';

interface TabDef {
	id: Tab;
	label: string;
	masterHide: boolean;
	masterShow: boolean;
}

const TABS: TabDef[] = [
	{ id: 'settings',    label: 'Settings',    masterHide: false, masterShow: false },
	{ id: 'description', label: 'Description', masterHide: false, masterShow: false },
	{ id: 'objects',   label: 'Objects',   masterHide: true,  masterShow: false },
	{ id: 'areas',     label: 'Areas',     masterHide: true,  masterShow: false },
	{ id: 'labels',    label: 'Labels',    masterHide: true,  masterShow: false },
	{ id: 'hierarchy', label: 'Hierarchy', masterHide: false, masterShow: true  },
	{ id: 'preview',   label: 'Preview',   masterHide: true,  masterShow: false },
	{ id: 'stories',   label: 'Stories',   masterHide: true,  masterShow: false },
];

interface Props {
	activeTab: Tab;
	isMaster: boolean;
	onChange: ( tab: Tab ) => void;
}

export default function TabBar( { activeTab, isMaster, onChange }: Props ) {
	const visible = TABS.filter( ( t ) => {
		if ( t.masterHide && isMaster ) return false;
		if ( t.masterShow && ! isMaster ) return false;
		return true;
	} );

	return (
		<SharedTabBar
			tabs={ visible }
			activeTab={ activeTab }
			onChange={ onChange }
			ariaLabel={ __( 'Editor modes', 'clouds-and-spaceships' ) }
		/>
	);
}
