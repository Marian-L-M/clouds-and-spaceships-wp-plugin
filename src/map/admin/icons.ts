import type { LibraryIcon } from '../types';
import { apiFetch } from './utils';

export let iconLibraryCache: LibraryIcon[] | null = null;

export async function loadIconLibraryIntoCache(): Promise<void> {
	try {
		iconLibraryCache = await apiFetch< LibraryIcon[] >( 'GET', '/icons' );
	} catch { iconLibraryCache = []; }
}
