(function ( blocks, element, components, i18n, blockEditor ) {
    const { __, sprintf } = i18n;
    const { createElement: el, Fragment } = element;
    const { TextControl, SelectControl, PanelBody, Notice } = components;
    const { InspectorControls, useBlockProps } = blockEditor;

    const MODE_OPTIONS = [
        { label: __('option_bubble', 'gurado'), value: 'bubble' },
        { label: __('option_embedded', 'gurado'), value: 'embedded' },
    ];

    const PAGE_OPTIONS = [
        { label: __('option_none', 'gurado'), value: '' },
        { label: __('option_products', 'gurado'), value: 'products' },
        { label: __('option_product', 'gurado'), value: 'product' },
        { label: __('option_checkout', 'gurado'), value: 'checkout' },
        { label: __('option_cart', 'gurado'), value: 'cart' },
    ];

    const ALIGN_OPTIONS = [
        { label: __('option_left', 'gurado'), value: 'left' },
        { label: __('option_right', 'gurado'), value: 'right' },
    ];

    blocks.registerBlockType('gurado/widget', {
        apiVersion: 2,
        title: __('plugin_title', 'gurado'),
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
                    el(PanelBody, { title: __('panel_title', 'gurado'), initialOpen: true },

                        el(TextControl, {
                            label: sprintf( __('field_shop_required', 'gurado'), __('field_shop_label', 'gurado') ),
                            //help: __('field_shop_desc', 'gurado'),
                            value: shop,
                            onChange: (v) => setAttributes({ shop: v })
                        }),

                        el(SelectControl, {
                            label: __('field_mode_label', 'gurado'),
                            //help: __('field_mode_desc', 'gurado'),
                            value: mode,
                            options: MODE_OPTIONS,
                            onChange: (v) => setAttributes({ mode: v })
                        }),

                        el(SelectControl, {
                            label: __('field_page_label', 'gurado'),
                            //help: __('field_page_desc', 'gurado'),
                            value: page,
                            options: PAGE_OPTIONS,
                            onChange: (v) => setAttributes({ page: v })
                        }),

                        isBubble && el(SelectControl, {
                            label: __('field_align_label', 'gurado'),
                            value: align || 'left',
                            options: ALIGN_OPTIONS,
                            onChange: (v) => setAttributes({ align: v })
                        }),

                        isBubble && el(TextControl, {
                            label: __('field_offsetX_label', 'gurado'),
                            value: offsetX,
                            onChange: (v) => setAttributes({ offsetX: v })
                        }),

                        isBubble && el(TextControl, {
                            label: __('field_offsetY_label', 'gurado'),
                            value: offsetY,
                            onChange: (v) => setAttributes({ offsetY: v })
                        }),

                        isProductPage && el(TextControl, {
                            label: __('field_product_label', 'gurado'),
                            value: product,
                            onChange: (v) => setAttributes({ product: v.replace(/[^0-9]/g, '') })
                        })
                    )
                ),

                el('div', blockProps,
                    el('strong', null, __('preview_title', 'gurado')),
                    el('div', { style: { marginTop: '8px', fontSize: '12px', opacity: 0.85 } },
                        el('code', null, '<gurado-widget ...></gurado-widget>')
                    ),
                    (!shop) &&
                    el(Notice, { status: 'warning', isDismissible: false, style: { marginTop: '12px' } },
                        sprintf( __('notice_missing_shop', 'gurado'), __('field_shop_label', 'gurado') )
                    ),
                    (shop) &&
                    el('ul', { style: { marginTop: '10px', marginBottom: 0 } },
                        el('li', null, __('field_shop_label', 'gurado'), ': ', el('code', null, shop || '—')),
                        el('li', null, __('field_mode_label', 'gurado'), ': ', el('code', null, mode || 'bubble')),
                        el('li', null, __('field_page_label', 'gurado'), ': ', el('code', null, page || __('option_none', 'gurado'))),
                        isBubble && el('li', null, __('field_align_label', 'gurado'), ': ', el('code', null, align || __('option_left', 'gurado'))),
                        isBubble && el('li', null, 'offsetX: ', el('code', null, offsetX || '—')),
                        isBubble && el('li', null, 'offsetY: ', el('code', null, offsetY || '—')),
                        isProductPage && el('li', null, __('field_product_label', 'gurado'), ': ', el('code', null, product || '—'))
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
