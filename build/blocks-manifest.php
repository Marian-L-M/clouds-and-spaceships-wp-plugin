<?php
// This file is generated. Do not modify it manually.
return array(
	'glossary-index' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-wiki-suite/glossary-index',
		'version' => '0.1.0',
		'title' => 'Glossary Index',
		'category' => 'widgets',
		'icon' => 'book-alt',
		'description' => 'Lists all glossary entries grouped alphabetically or by category, with links to each definition.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'attributes' => array(
			'groupBy' => array(
				'type' => 'string',
				'default' => 'alphabetical',
				'enum' => array(
					'alphabetical',
					'category'
				)
			),
			'showEmptyNotice' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'textdomain' => 'clouds-and-spaceships',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'infobox' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-wiki-suite/infobox',
		'version' => '0.1.0',
		'title' => 'Infobox',
		'category' => 'widgets',
		'icon' => 'welcome-widgets-menus',
		'description' => 'An infobox style block preset.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false,
			'interactivity' => true,
			'align' => array(
				'left',
				'center',
				'right'
			)
		),
		'attributes' => array(
			'maxWidth' => array(
				'type' => 'string'
			),
			'bg_color' => array(
				'type' => 'string'
			),
			'contrast_color' => array(
				'type' => 'string'
			),
			'infobox_title' => array(
				'type' => 'string'
			),
			'is_infobox_open' => array(
				'type' => 'boolean',
				'default' => true
			),
			'display_mode' => array(
				'type' => 'string',
				'default' => 'collapse__groups-mobile'
			),
			'text_color' => array(
				'type' => 'string'
			)
		),
		'allowedBlocks' => array(
			'cns-wiki-suite/infobox-group',
			'cns-wiki-suite/infobox-row',
			'core/paragraph',
			'core/heading',
			'core/list',
			'core/image'
		),
		'textdomain' => 'clouds-and-spaceships',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScriptModule' => 'file:./view.js'
	),
	'infobox-group' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-wiki-suite/infobox-group',
		'parent' => array(
			'cns-wiki-suite/infobox'
		),
		'version' => '0.1.0',
		'title' => 'Infobox Group',
		'category' => 'widgets',
		'icon' => 'feedback',
		'description' => 'Group block to be used inside of a CNS infobox',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'group_title' => array(
				'type' => 'string'
			),
			'is_group_open' => array(
				'type' => 'boolean',
				'default' => true
			),
			'bg_color' => array(
				'type' => 'string'
			),
			'text_color' => array(
				'type' => 'string'
			),
			'contrast_color' => array(
				'type' => 'string'
			),
			'display_mode' => array(
				'type' => 'string',
				'default' => 'inherit'
			)
		),
		'textdomain' => 'clouds-and-spaceships',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScriptModule' => 'file:./view.js'
	),
	'infobox-row' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-wiki-suite/infobox-row',
		'ancestor' => array(
			'cns-wiki-suite/infobox'
		),
		'version' => '0.1.0',
		'title' => 'Infobox Row',
		'category' => 'widgets',
		'icon' => 'slides',
		'description' => 'Infobox style table row',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'mode' => array(
				'type' => 'string',
				'default' => 'datalist'
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					
				)
			)
		),
		'textdomain' => 'clouds-and-spaceships',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'map' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-map-suite/map',
		'version' => '0.1.0',
		'title' => 'CNS Map',
		'category' => 'widgets',
		'icon' => 'location-alt',
		'description' => 'Embed an interactive canvas map created in the Maps admin.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'mapId' => array(
				'type' => 'integer',
				'default' => 0
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'textdomain' => 'clouds-and-spaceships',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./editor-index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	),
	'story' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-story-suite/story',
		'version' => '0.1.0',
		'title' => 'CNS Story',
		'category' => 'embed',
		'description' => 'Embed a branching interactive story canvas with a story window.',
		'keywords' => array(
			'story',
			'canvas',
			'interactive'
		),
		'textdomain' => 'clouds-and-spaceships',
		'attributes' => array(
			'storyId' => array(
				'type' => 'integer',
				'default' => 0
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			)
		),
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js',
		'style' => 'file:./style-index.css',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css'
	),
	'wiki-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-wiki-suite/wiki-card',
		'version' => '0.1.0',
		'title' => 'Wiki Card',
		'category' => 'widgets',
		'icon' => 'index-card',
		'description' => 'Display a post as a card with thumbnail, title, excerpt and link. Designed for wiki post types.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'postId' => array(
				'type' => 'number',
				'default' => 0
			),
			'postType' => array(
				'type' => 'string',
				'default' => 'wiki'
			),
			'backgroundColor' => array(
				'type' => 'string',
				'default' => '#f0f0f0'
			),
			'textColor' => array(
				'type' => 'string',
				'default' => ''
			),
			'showThumbnail' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showTitle' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showCategories' => array(
				'type' => 'boolean',
				'default' => false
			),
			'showExcerpt' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showTags' => array(
				'type' => 'boolean',
				'default' => false
			),
			'showLink' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'textdomain' => 'clouds-and-spaceships',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'wiki-contents' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-wiki-suite/wiki-contents',
		'version' => '0.1.0',
		'title' => 'Wiki Contents',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => 'A responsive grid of wiki cards. Populate manually or auto-fill with the newest wikis.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'allowedBlocks' => array(
			'cns-wiki-suite/wiki-card'
		),
		'attributes' => array(
			'mode' => array(
				'type' => 'string',
				'default' => 'manual'
			),
			'columnsMobile' => array(
				'type' => 'number'
			),
			'columnsTablet' => array(
				'type' => 'number'
			),
			'columnsDesktop' => array(
				'type' => 'number'
			),
			'numberOfPosts' => array(
				'type' => 'number',
				'default' => 3
			),
			'columnGap' => array(
				'type' => 'number'
			),
			'rowGap' => array(
				'type' => 'number'
			)
		),
		'textdomain' => 'clouds-and-spaceships',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	)
);
