import type { AreaType, ObjectType, ShapeType } from './choices';

// ── WordPress globals ─────────────────────────────────────────────────────────

interface WpMediaSelection {
	first(): {
		toJSON(): { id: number; url: string; [ key: string ]: unknown };
	};
}
interface WpMediaState {
	get( key: 'selection' ): WpMediaSelection;
}
interface WpMediaFrame {
	on( event: string, handler: () => void ): WpMediaFrame;
	open(): void;
	state(): WpMediaState;
}
interface WpMediaOptions {
	title: string;
	button: { text: string };
	multiple: boolean;
	library?: { type: string };
}

// Classic (TinyMCE) editor API from wp_enqueue_editor(). Exposed as
// wp.oldEditor when the block-editor's wp-editor package is also loaded,
// wp.editor otherwise.
export interface WpClassicEditor {
	initialize( id: string, settings?: Record< string, unknown > ): void;
	remove( id: string ): void;
}

/** The subset of a TinyMCE instance the Description tab reads back. */
export interface TinyMceEditor {
	on( events: string, handler: () => void ): void;
	getContent(): string;
	isHidden(): boolean;
}

declare global {
	interface Window {
		cnsMapEditor: CnsMapEditorGlobal;
		cnsMapSuite: CnsMapSuiteGlobal;
		wp: {
			media: ( options: WpMediaOptions ) => WpMediaFrame;
			editor?: WpClassicEditor;
			oldEditor?: WpClassicEditor;
		};
		tinymce?: { get( id: string ): TinyMceEditor | null };
	}
}

export interface ParentMapRef {
	map_id: number;
	title: string;
	thumbnail: string;
	url: string;
}

export interface CnsMapEditorGlobal {
	/** CNS → Stories tab, linked from the editor's Stories panel. */
	storiesOverviewUrl: string;
	mapId: number;
	isNew: boolean;
	status: PostStatus;
	title: string;
	description: string;
	width: number;
	aspectRatio: number;
	time: number;
	imageId: number;
	imageUrl: string;
	imageX: number;
	imageY: number;
	imageWidth: number;
	isMaster: boolean;
	bgType: BgType;
	bgColor: string;
	bgImageId: number;
	bgImageUrl: string;
	thumbnailId: number;
	thumbnailUrl: string;
	overviewUrl: string;
	viewUrl: string;
	/** Stock post editor for this map; empty when unsaved or not permitted. */
	wpEditUrl: string;
	parentMaps: ParentMapRef[];
}

export interface CnsMapSuiteGlobal {
	nonce: string;
	restUrl: string;
	wpRestUrl: string;
	iconsUrl: string;
}

// ── Primitive unions ──────────────────────────────────────────────────────────

export type PostStatus = 'publish' | 'draft' | 'private';
// AreaType, ObjectType and ShapeType are derived from the choice lists in
// choices.ts, so each union and its form dropdown cannot drift apart.
export type { AreaType, ObjectType, ShapeType };
export type InfoboxSource = 'manual' | 'post';
export type IconSource = 'svg' | 'image';
export type BgType = 'color' | 'image';
export type Tab =
	| 'settings'
	| 'description'
	| 'objects'
	| 'areas'
	| 'labels'
	| 'hierarchy'
	| 'preview'
	| 'stories';
export type LabelPlacement = 'centered' | 'indicator';

// ── Canvas ────────────────────────────────────────────────────────────────────

export interface CanvasPoint {
	x: number;
	y: number;
}

// ── Domain: Node ──────────────────────────────────────────────────────────────

export interface Node {
	x: number; // 0–1 normalised relative to canvas width/height
	y: number;
}

// ── Domain: canvas style bags ─────────────────────────────────────────────────

export interface ObjectCanvasStyles {
	size?: number;
	fillStyle?: string;
	strokeStyle?: string;
}

/**
 * Canvas label styling, shared by map areas and hierarchy regions. `labelHidden`
 * is stored rather than inferred so an author can keep a title for lists and
 * infoboxes while leaving the shape unlabelled on the canvas.
 */
export interface LabelStyleFields {
	labelHidden?: boolean;
	labelFontFamily?: string;
	labelFontSize?: number;
	labelColor?: string;
}

export interface AreaCanvasStyles extends LabelStyleFields {
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
}

// ── Domain: infobox data (stored as JSON in the DB) ───────────────────────────

export interface InfoboxData {
	title?: string;
	description?: string;
	image_id?: number;
	// Per-item display flags (default on when absent). display_infobox pulls the
	// connected post's wiki-suite infoboxes into the drawer, independent of the
	// content source; show_* gate the connected post's own fields.
	display_infobox?: boolean;
	show_title?: boolean;
	show_excerpt?: boolean;
	show_thumbnail?: boolean;
}

// ── Domain: MapObject ─────────────────────────────────────────────────────────

export interface MapObject {
	id: number;
	map_id: number;
	linked_post_id: number | null;
	type: ObjectType;
	svg_slug: string;
	icon_image_id: number | null;
	icon_url: string;
	icon_mime: string;
	title: string;
	x: number; // canvas pixel coordinate
	y: number;
	object_time: number;
	infobox_source: InfoboxSource;
	infobox_data: InfoboxData | null;
	canvas_styles: ObjectCanvasStyles | null;
	created_at: string;
	updated_at: string;
}

// ── Domain: MapArea ───────────────────────────────────────────────────────────

export interface MapArea {
	id: number;
	map_id: number;
	linked_post_id: number | null;
	type: AreaType;
	shape_type: ShapeType;
	title: string;
	object_time: number;
	nodes: Node[];
	background_image_id: number | null;
	infobox_source: InfoboxSource;
	infobox_data: InfoboxData | null;
	canvas_styles: AreaCanvasStyles | null;
	created_at: string;
	updated_at: string;
}

// ── Domain: MapLabel ──────────────────────────────────────────────────────────

export interface LabelCanvasStyles {
	bgColor?: string;
	borderColor?: string;
	textColor?: string;
	fontSize?: number;
}

export interface MapLabel {
	id: number;
	map_id: number;
	linked_post_id: number | null;
	text: string;
	x: number; // canvas pixel coordinate (anchor point)
	y: number;
	placement: LabelPlacement;
	offset_x: number; // label box offset from anchor (indicator mode)
	offset_y: number;
	object_time: number;
	infobox_source: InfoboxSource;
	infobox_data: InfoboxData | null;
	canvas_styles: LabelCanvasStyles | null;
	created_at: string;
	updated_at: string;
}

// ── Domain: HierarchyRegion ───────────────────────────────────────────────────

export interface HierarchyCanvasStyles extends LabelStyleFields {
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	tipBgColor?: string;
	tipBorderColor?: string;
	tipTextColor?: string;
}

export interface HierarchyRegion {
	id: number;
	parent_map_id: number;
	child_map_id: number;
	shape_type: ShapeType;
	nodes: Node[];
	canvas_styles: HierarchyCanvasStyles | null;
	title_override: string | null;
	description_override: string | null;
	child_map_title: string;
	child_map_excerpt: string;
	child_map_status: string;
	child_map_thumbnail: string;
	child_map_url: string;
	created_at: string;
	updated_at: string;
}

export interface HierarchyFormData {
	child_map_id: number;
	child_map_label: string;
	shape_type: ShapeType;
	title_override: string;
	description_override: string;
	style_fill: string;
	style_stroke: string;
	style_stroke_width: number;
	style_label_hidden: boolean;
	style_label_font_family: string;
	style_label_font_size: number;
	style_label_color: string;
	style_tip_bg: string;
	style_tip_border: string;
	style_tip_text: string;
}

// ── Domain: LibraryIcon ───────────────────────────────────────────────────────

export interface LibraryIcon {
	id: number;
	url: string;
	title: string;
}

// ── Domain: MediaAttachment ───────────────────────────────────────────────────

export interface MediaAttachment {
	id: number;
	url: string;
}

// ── Domain: PostSearchResult ──────────────────────────────────────────────────

export interface PostSearchResult {
	id: number;
	title: string;
	subtype: string;
}

// ── Editor state ──────────────────────────────────────────────────────────────

export interface MapSettings {
	status: PostStatus;
	title: string;
	description: string;
	width: number;
	aspectRatio: number;
	time: number;
	imageId: number;
	imageUrl: string;
	imageX: number;
	imageY: number;
	imageW: number;
	isMaster: boolean;
	bgType: BgType;
	bgColor: string;
	bgImageId: number;
	bgImageUrl: string;
	thumbnailId: number | null;
	thumbnailUrl: string;
}

export interface DrawState {
	width: number;
	aspectRatio: number;
	bgType: BgType;
	bgColor: string;
	bgImageUrl: string;
	imgUrl: string;
	imageX: number;
	imageY: number;
	imageW: number;
}

// ── Form data ─────────────────────────────────────────────────────────────────

// The infobox form fields shared by object/area/label forms — rendered by
// the shared <InfoboxSection>. infobox_image_url and linked_post_label are
// editor-only (image preview, post-search label) and stay out of payloads.
export interface InfoboxFormFields {
	infobox_source: InfoboxSource;
	infobox_title: string;
	infobox_description: string;
	infobox_image_id: number;
	infobox_image_url: string;
	linked_post_id: number;
	linked_post_label: string;
	display_infobox: boolean;
	show_title: boolean;
	show_excerpt: boolean;
	show_thumbnail: boolean;
}

export interface ObjectFormData extends InfoboxFormFields {
	icon_source: IconSource;
	icon_image_id_svg: number | null;
	icon_image_id_custom: number;
	icon_image_url: string;
	title: string;
	type: ObjectType;
	object_time: number;
	x: number;
	y: number;
	style_size: number;
	style_fill: string;
	style_stroke: string;
}

export interface AreaFormData extends InfoboxFormFields {
	style_label_hidden: boolean;
	style_label_font_family: string;
	style_label_font_size: number;
	style_label_color: string;
	title: string;
	type: AreaType;
	shape_type: ShapeType;
	object_time: number;
	style_fill: string;
	style_stroke: string;
	style_stroke_width: number;
}

export interface LabelFormData extends InfoboxFormFields {
	text: string;
	placement: LabelPlacement;
	x: number;
	y: number;
	offset_x: number;
	offset_y: number;
	object_time: number;
	style_bg: string;
	style_border: string;
	style_text_color: string;
	style_font_size: number;
}

// ── API payloads ──────────────────────────────────────────────────────────────

export interface ObjectSavePayload {
	icon_image_id: number;
	title: string;
	type: ObjectType;
	x: number;
	y: number;
	object_time: number;
	infobox_source: InfoboxSource;
	linked_post_id: number;
	infobox_title: string;
	infobox_description: string;
	infobox_image_id: number;
	display_infobox: boolean;
	show_title: boolean;
	show_excerpt: boolean;
	show_thumbnail: boolean;
	style_size: number;
	style_fill: string;
	style_stroke: string;
}

export type AreaSavePayload = AreaFormData & { nodes: string };

// Editor-only fields (image preview URL, post-search label) stay out of the payload.
export type LabelSavePayload = Omit<
	LabelFormData,
	'infobox_image_url' | 'linked_post_label'
>;

// ── Canvas callback signatures (used to avoid circular imports) ───────────────

export type DrawAreaFn = (
	ctx: CanvasRenderingContext2D,
	area: MapArea,
	W: number,
	H: number,
	isSelected: boolean,
	repoNodeIdx: number | null,
	repoCursor: CanvasPoint | null
) => void;

export type DrawObjectFn = (
	ctx: CanvasRenderingContext2D,
	obj: MapObject,
	isSelected: boolean
) => Promise< void >;
