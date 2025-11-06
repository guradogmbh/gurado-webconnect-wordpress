// block.js
(function ( blocks, element, components, i18n, blockEditor ) {
    const { __, sprintf } = i18n;
    const { createElement: el, Fragment } = element;
    const { TextControl, SelectControl, PanelBody, Notice } = components;
    const { InspectorControls, useBlockProps } = blockEditor;

    const MODE_OPTIONS = [
        { label: __('bubble', 'gurado-webconnect'), value: 'bubble' },
        { label: __('embedded', 'gurado-webconnect'), value: 'embedded' },
    ];

    const PAGE_OPTIONS = [
        { label: __('— None —', 'gurado-webconnect'), value: '' },
        { label: __('products', 'gurado-webconnect'), value: 'products' },
        { label: __('product', 'gurado-webconnect'), value: 'product' },
        { label: __('checkout', 'gurado-webconnect'), value: 'checkout' },
        { label: __('cart', 'gurado-webconnect'), value: 'cart' },
    ];

    const ALIGN_OPTIONS = [
        { label: __('left', 'gurado-webconnect'), value: 'left' },
        { label: __('right', 'gurado-webconnect'), value: 'right' },
    ];

    blocks.registerBlockType('gurado/webconnect', {
        apiVersion: 2,
        title: __('gurado WebConnect', 'gurado-webconnect'), // Geändert von 'plugin_title'
        icon: 'tickets-alt',
        category: 'widgets',
        attributes: {
            shop:    { type: 'string', default: '' },
            mode:    { type: 'string', default: 'bubble' },
            page:    { type: 'string', default: '' },
            align:   { type: 'string', default: '' },
            offsetX: { type: 'string', default: '' },
            offsetY: { type: 'string', default: '' },
            product: { type: 'string', default: '' },
        },
        supports: { html: false },

        edit: (props) => {
            const { attributes, setAttributes } = props;
            const { shop, mode, page, align, offsetX, offsetY, product } = attributes;

            const blockProps = useBlockProps({
                className: 'gwb-editor',
                style: {
                    border: '1px dashed #c3c4c7',
                    padding: '16px',
                    borderRadius: '8px',
                    background: '#fff'
                }
            });

            const isBubble = mode === 'bubble';
            const isProductPage = page === 'product';

            return el(Fragment, null,
                el(InspectorControls, null,
                    el(PanelBody, { title: __('gurado WebConnect Settings', 'gurado-webconnect'), initialOpen: true }, // Geändert von 'panel_title'

                        el(TextControl, {
                            // Geändert von 'field_shop_required' und 'field_shop_label'
                            label: sprintf( __('%s (required)', 'gurado-webconnect'), __('Shop', 'gurado-webconnect') ),
                            value: shop,
                            onChange: (v) => setAttributes({ shop: v })
                        }),

                        el(SelectControl, {
                            label: __('Mode', 'gurado-webconnect'), // Geändert von 'field_mode_label'
                            value: mode,
                            options: MODE_OPTIONS,
                            onChange: (v) => setAttributes({ mode: v })
                        }),

                        el(SelectControl, {
                            label: __('Entry Page', 'gurado-webconnect'), // Geändert von 'field_page_label'
                            value: page,
                            options: PAGE_OPTIONS,
                            onChange: (v) => setAttributes({ page: v })
                        }),

                        isBubble && el(SelectControl, {
                            label: __('Alignment', 'gurado-webconnect'), // Geändert von 'field_align_label'
                            value: align || 'left',
                            options: ALIGN_OPTIONS,
                            onChange: (v) => setAttributes({ align: v })
                        }),

                        isBubble && el(TextControl, {
                            label: __('Offset X (e.g., 1rem, 8px)', 'gurado-webconnect'), // Geändert von 'field_offsetX_label'
                            value: offsetX,
                            onChange: (v) => setAttributes({ offsetX: v })
                        }),

                        isBubble && el(TextControl, {
                            label: __('Offset Y (e.g., 5px, 1rem)', 'gurado-webconnect'), // Geändert von 'field_offsetY_label'
                            value: offsetY,
                            onChange: (v) => setAttributes({ offsetY: v })
                        }),

                        isProductPage && el(TextControl, {
                            label: __('Product (numeric ID)', 'gurado-webconnect'), // Geändert von 'field_product_label'
                            value: product,
                            onChange: (v) => setAttributes({ product: v.replace(/[^0-9]/g, '') })
                        })
                    )
                ),

                el('div', blockProps,
                    el('strong', null, __('gurado WebConnect', 'gurado-webconnect')), // Geändert von 'preview_title'
                    el('div', { style: { marginTop: '8px', fontSize: '12px', opacity: 0.85 } },
                        el('code', null, '<gurado-widget ...></gurado-widget>')
                    ),
                    (!shop) &&
                    el(Notice, { status: 'warning', isDismissible: false, style: { marginTop: '12px' } },
                        // Geändert von 'notice_missing_shop' und 'field_shop_label'
                        sprintf( __('Please fill in “%s” so the widget can render on the front end.', 'gurado-webconnect'), __('Shop', 'gurado-webconnect') )
                    ),
                    (shop) &&
                    el('ul', { style: { marginTop: '10px', marginBottom: 0 } },
                        el('li', null, __('Shop', 'gurado-webconnect'), ': ', el('code', null, shop || '—')),
                        el('li', null, __('Mode', 'gurado-webconnect'), ': ', el('code', null, mode || 'bubble')),
                        el('li', null, __('Entry Page', 'gurado-webconnect'), ': ', el('code', null, page || __('— None —', 'gurado-webconnect'))), // Geändert
                        isBubble && el('li', null, __('Alignment', 'gurado-webconnect'), ': ', el('code', null, align || __('left', 'gurado-webconnect'))), // Geändert
                        isBubble && el('li', null, 'Offset X: ', el('code', null, offsetX || '—')),
                        isBubble && el('li', null, 'Offset Y: ', el('code', null, offsetY || '—')),
                        isProductPage && el('li', null, __('Product (numeric ID)', 'gurado-webconnect'), ': ', el('code', null, product || '—'))
                    )
                )
            );
        },

        save: () => null
    });
})(
    window.wp.blocks,
    window.wp.element,
    window.wp.components,
    window.wp.i18n,
    window.wp.blockEditor
);
