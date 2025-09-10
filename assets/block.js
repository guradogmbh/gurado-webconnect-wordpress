(function ( blocks, element, components, i18n, blockEditor ) {
	const { __ } = i18n;
	const { createElement: el, Fragment } = element;
	const { TextControl, SelectControl, PanelBody, Notice } = components;
	const { InspectorControls, useBlockProps } = blockEditor;

	blocks.registerBlockType('gurado/widget', {
		apiVersion: 2,
		title: __('Gurado: Gutschein-Widget', 'gurado-widget'),
		icon: 'tickets-alt',
		category: 'widgets',
		attributes: {
			name:   { type: 'string', default: '' },
			lang:   { type: 'string', default: 'de' },
			mode:   { type: 'string', default: 'bubble' },
			align:  { type: 'string', default: '' },
			key:    { type: 'string', default: '' },
			client: { type: 'string', default: '' },
		},
		supports: { html: false },

		edit: (props) => {
			const { attributes, setAttributes } = props;
			const blockProps = useBlockProps({
				className: 'gwb-editor',
				style: {
					border: '1px dashed #c3c4c7',
					padding: '16px',
					borderRadius: '8px',
					background: '#fff'
				}
			});

			return el(Fragment, null,
				el(InspectorControls, null,
					el(PanelBody, { title: __('Gurado-Widget Einstellungen', 'gurado-widget'), initialOpen: true },
						el(TextControl, {
							label: __('Titel (name)', 'gurado-widget'),
							value: attributes.name,
							placeholder: __('Gutscheine für bessere Unternehmen', 'gurado-widget'),
							onChange: (v) => setAttributes({ name: v })
						}),
						el(SelectControl, {
							label: __('Sprache (lang)', 'gurado-widget'),
							value: attributes.lang,
							options: [
								{ label: 'Deutsch (de)', value: 'de' },
								{ label: 'English (en)', value: 'en' },
								{ label: 'Français (fr)', value: 'fr' },
								{ label: '—', value: '' },
							],
							onChange: (v) => setAttributes({ lang: v })
						}),
						el(SelectControl, {
							label: __('Modus (mode)', 'gurado-widget'),
							value: attributes.mode,
							options: [
								{ label: 'bubble (Standard)', value: 'bubble' },
								{ label: 'embedded', value: 'embedded' },
							],
							onChange: (v) => setAttributes({ mode: v })
						}),
						el(SelectControl, {
							label: __('Ausrichtung (align)', 'gurado-widget'),
							value: attributes.align,
							options: [
								{ label: '—', value: '' },
								{ label: 'left', value: 'left' },
								{ label: 'center', value: 'center' },
								{ label: 'right', value: 'right' },
							],
							onChange: (v) => setAttributes({ align: v })
						}),
						el(TextControl, {
							label: __('Schlüssel (key) — erforderlich', 'gurado-widget'),
							value: attributes.key,
							onChange: (v) => setAttributes({ key: v })
						}),
						el(TextControl, {
							label: __('Klienten-ID (client) — erforderlich', 'gurado-widget'),
							value: attributes.client,
							onChange: (v) => setAttributes({ client: v })
						})
					)
				),

				el('div', blockProps,
					el('strong', null, 'Gurado-Widget (Vorschau)'),
					el('div', { style: { marginTop: '8px', fontSize: '12px', opacity: 0.85 } },
						el('code', null, '<gurado-widget ...></gurado-widget>')
					),
					(!attributes.key || !attributes.client) &&
						el(Notice, { status: 'warning', isDismissible: false, style: { marginTop: '12px' } },
							__('Bitte „key“ und „client“ ausfüllen, damit das Widget im Frontend gerendert wird.', 'gurado-widget')
						),
					(attributes.key && attributes.client) &&
						el('ul', { style: { marginTop: '10px', marginBottom: 0 } },
							el('li', null, 'name: ', el('code', null, attributes.name || '—')),
							el('li', null, 'lang: ', el('code', null, attributes.lang || '—')),
							el('li', null, 'mode: ', el('code', null, attributes.mode || 'bubble')),
							el('li', null, 'align: ', el('code', null, attributes.align || '—')),
							el('li', null, 'key: ', el('code', null, '••••••••')),
							el('li', null, 'client: ', el('code', null, '••••••••'))
						)
				)
			);
		},

		save: () => null // dynamisch via PHP
	});
})(
	window.wp.blocks,
	window.wp.element,
	window.wp.components,
	window.wp.i18n,
	window.wp.blockEditor
);
