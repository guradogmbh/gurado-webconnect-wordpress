(function ( blocks, element, components, i18n, blockEditor ) {
    const { __, _x, sprintf } = i18n;
    const { createElement: el, Fragment } = element;
    const { TextControl, SelectControl, PanelBody, Notice } = components;
    const { InspectorControls, useBlockProps } = blockEditor;

    const MODE_OPTIONS = [
        { label: _x('bubble', 'widget render mode', 'gurado-widget'), value: 'bubble' },
        { label: _x('embedded', 'widget render mode', 'gurado-widget'), value: 'embedded' },
    ];

    const PAGE_OPTIONS = [
        { label: _x('products', 'entry page', 'gurado-widget'), value: 'products' },
        { label: _x('product', 'entry page', 'gurado-widget'), value: 'product' },
        { label: _x('checkout', 'entry page', 'gurado-widget'), value: 'checkout' },
        { label: _x('payment', 'entry page', 'gurado-widget'), value: 'payment' },
        { label: _x('cart', 'entry page', 'gurado-widget'), value: 'cart' },
    ];

    const ALIGN_OPTIONS = [
        { label: _x('left', 'bubble align', 'gurado-widget'), value: 'left' },
        { label: _x('right', 'bubble align', 'gurado-widget'), value: 'right' },
    ];

    blocks.registerBlockType('gurado/widget', {
        apiVersion: 2,
        title: __('Gurado: Gutschein-Widget', 'gurado-widget'),
        icon: 'tickets-alt',
        category: 'widgets',
        attributes: {
            shop:    { type: 'string', default: '' },
            mode:    { type: 'string', default: 'bubble' },
            page:    { type: 'string', default: 'products' },
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
                    el(PanelBody, { title: __('Gurado-Widget Einstellungen', 'gurado-widget'), initialOpen: true },

                        el(TextControl, {
                            label: sprintf( __('%s (required)', 'gurado-widget'), __('Shop', 'gurado-widget') ),
                            help: __('Erforderlich, damit das Widget angezeigt wird.', 'gurado-widget'),
                            value: shop,
                            onChange: (v) => setAttributes({ shop: v })
                        }),

                        el(SelectControl, {
                            label: __('Modus', 'gurado-widget'),
                            help: __('Darstellung des Widgets', 'gurado-widget'),
                            value: mode,
                            options: MODE_OPTIONS,
                            onChange: (v) => setAttributes({ mode: v })
                        }),

                        el(SelectControl, {
                            label: __('Entry-Page (page)', 'gurado-widget'),
                            help: __('Bestimmt, mit welcher Shop-Ansicht gestartet wird.', 'gurado-widget'),
                            value: page,
                            options: PAGE_OPTIONS,
                            onChange: (v) => setAttributes({ page: v })
                        }),

                        isBubble && el(SelectControl, {
                            label: __('Ausrichtung (align)', 'gurado-widget'),
                            value: align || 'left',
                            options: ALIGN_OPTIONS,
                            onChange: (v) => setAttributes({ align: v })
                        }),

                        isBubble && el(TextControl, {
                            label: sprintf( __('%s (z. B. %s, %s)', 'gurado-widget'), 'offsetX', '1rem', '8px' ),
                            value: offsetX,
                            onChange: (v) => setAttributes({ offsetX: v })
                        }),

                        isBubble && el(TextControl, {
                            label: sprintf( __('%s (z. B. %s, %s)', 'gurado-widget'), 'offsetY', '5px', '1rem' ),
                            value: offsetY,
                            onChange: (v) => setAttributes({ offsetY: v })
                        }),

                        isProductPage && el(TextControl, {
                            label: __('Product (ID als Zahl)', 'gurado-widget'),
                            value: product,
                            onChange: (v) => setAttributes({ product: v.replace(/[^0-9]/g, '') })
                        })
                    )
                ),

                el('div', blockProps,
                    el('strong', null, __('Gurado-Widget (Vorschau)', 'gurado-widget')),
                    el('div', { style: { marginTop: '8px', fontSize: '12px', opacity: 0.85 } },
                        el('code', null, '<gurado-widget ...></gurado-widget>')
                    ),
                    (!shop) &&
                    el(Notice, { status: 'warning', isDismissible: false, style: { marginTop: '12px' } },
                        sprintf( __('Bitte „%s“ ausfüllen, damit das Widget im Frontend gerendert wird.', 'gurado-widget'), 'shop' )
                    ),
                    (shop) &&
                    el('ul', { style: { marginTop: '10px', marginBottom: 0 } },
                        el('li', null, 'shop: ', el('code', null, shop || '—')),
                        el('li', null, 'mode: ', el('code', null, mode || 'bubble')),
                        el('li', null, 'page: ', el('code', null, page || 'products')),
                        isBubble && el('li', null, sprintf( __('%s:', 'gurado-widget'), 'align' ), el('code', null, align || 'left')),
                        isBubble && el('li', null, 'offsetX: ', el('code', null, offsetX || '—')),
                        isBubble && el('li', null, 'offsetY: ', el('code', null, offsetY || '—')),
                        isProductPage && el('li', null, 'product: ', el('code', null, product || '—'))
                    )
                )
            );
        },

        save: () => null // dynamischer Block (PHP-Render)
    });
})(
    window.wp.blocks,
    window.wp.element,
    window.wp.components,
    window.wp.i18n,
    window.wp.blockEditor
);
