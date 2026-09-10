declare module '*.scss' {
	const content: Record<string, string>;
	export default content;
}

/** Toast notification severity. */
type CnsToastType = 'success' | 'error' | 'info' | 'warning';

/** Public API exposed by src/toast/index.ts on the global window. */
interface CnsToast {
	show( message: string, type?: CnsToastType, duration?: number ): HTMLElement;
}

interface Window {
	cnsToast?: CnsToast;
}
