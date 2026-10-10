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
	{ id: 'settings',    label: __( 'Settings', 'clouds-and-spaceships' ), masterHide: false, masterShow: false },
	{ id: 'description', label: __( 'Description', 'clouds-and-spaceships' ), masterHide: false, masterShow: false },
	{ id: 'objects',   label: __( 'Objects', 'clouds-and-spaceships' ), masterHide: true,  masterShow: false },
	{ id: 'areas',     label: __( 'Areas', 'clouds-and-spaceships' ), masterHide: true,  masterShow: false },
	{ id: 'labels',    label: __( 'Labels', 'clouds-and-spaceships' ), masterHide: true,  masterShow: false },
	{ id: 'hierarchy', label: __( 'Hierarchy', 'clouds-and-spaceships' ), masterHide: false, masterShow: true  },
	{ id: 'preview',   label: __( 'Preview', 'clouds-and-spaceships' ), masterHide: true,  masterShow: false },
	{ id: 'stories',   label: __( 'Stories', 'clouds-and-spaceships' ), masterHide: true,  masterShow: false },
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
