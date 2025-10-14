<?php
/**
 * Plugin Name: gurado WebConnect
 * Description: The one-stop software for vouchers, tickets, coupons, and loyalty programs that helps you achieve great things with your business.
 * Version:     1.1.0
 * Author:      gurado GmbH
 * License:     GPL-2.0-or-later
 * Text Domain: gurado
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'GURADO_WIDGET_VERSION', '1.0.0' );
define( 'GURADO_WIDGET_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'GURADO_WIDGET_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'GURADO_WIDGET_JS', 'statics.gurado.de/widget/assets/widget.js' );

function gwb_register_frontend_script() {
    $base = GURADO_WIDGET_JS;
    $src  = is_ssl() ? "https://{$base}" : "http://{$base}";
    wp_register_script( 'gurado-widget', $src, array(), null, true );
}
add_action( 'init', 'gwb_register_frontend_script' );

function gwb_build_gurado_tag( $attrs ) {
    $defaults = array(
        'shop'    => '',
        'mode'    => 'bubble',
        'page'    => '',
        'align'   => '',
        'offsetX' => '',
        'offsetY' => '',
        'product' => '',
    );
    $a = wp_parse_args( (array) $attrs, $defaults );

    $shop    = trim( wp_strip_all_tags( (string) $a['shop'] ) );
    $mode    = trim( wp_strip_all_tags( (string) $a['mode'] ) );
    $page    = trim( wp_strip_all_tags( (string) $a['page'] ) );
    $align   = trim( wp_strip_all_tags( (string) $a['align'] ) );
    $offsetX = trim( wp_strip_all_tags( (string) $a['offsetX'] ) );
    $offsetY = trim( wp_strip_all_tags( (string) $a['offsetY'] ) );
    $product = trim( (string) $a['product'] );

    if ( $shop === '' ) {
        return '<div class="gwb-notice" style="color:#b11;">gurado WebConnect: ' . __( 'shop_required', 'gurado' ) . '</div>';
    }

    $mode_allowed = array( 'bubble', 'embedded' );
    if ( ! in_array( $mode, $mode_allowed, true ) ) $mode = 'bubble';

    $page_allowed = array( 'product', 'products', 'checkout', 'cart' );
    if ( $page !== '' && ! in_array( $page, $page_allowed, true ) ) {
        $page = '';
    }

    if ( $mode === 'bubble' ) {
        $align_allowed = array( 'left', 'right' );
        if ( $align === '' ) {
            $align = 'left';
        } elseif ( ! in_array( $align, $align_allowed, true ) ) {
            $align = 'left';
        }
    } else {
        $align = $offsetX = $offsetY = '';
    }

    if ( $page === 'product' ) {
        $product = ( $product !== '' ) ? (string) intval( $product, 10 ) : '';
    } else {
        $product = '';
    }

    $attrs_html = array( 'shop="' . esc_attr( $shop ) . '"' );
    $attrs_html[] = 'mode="' . esc_attr( $mode ) . '"';

    if ( $page !== '' )    $attrs_html[] = 'page="'    . esc_attr( $page )    . '"';
    if ( $mode === 'bubble' ) {
        if ( $align !== '' )   $attrs_html[] = 'align="'   . esc_attr( $align )   . '"';
        if ( $offsetX !== '' ) $attrs_html[] = 'offsetX="' . esc_attr( $offsetX ) . '"';
        if ( $offsetY !== '' ) $attrs_html[] = 'offsetY="' . esc_attr( $offsetY ) . '"';
    }
    if ( $page === 'product' && $product !== '' ) {
        $attrs_html[] = 'product="' . esc_attr( $product ) . '"';
    }

    return '<gurado-widget ' . implode( ' ', $attrs_html ) . '></gurado-widget>';
}


function gwb_ensure_script_enqueued() {
    if ( ! wp_script_is( 'gurado-widget', 'enqueued' ) ) {
        wp_enqueue_script( 'gurado-widget' );
    }
}

/**
 * Shortcode: [gurado_widget ...]
 */
function gwb_shortcode( $atts = array() ) {
    gwb_ensure_script_enqueued();
    return gwb_build_gurado_tag( $atts );
}
add_shortcode( 'gurado_widget', 'gwb_shortcode' );


/**
 * Gutenberg-Block registrieren
 */
function gwb_register_block() {
    wp_register_script(
        'gwb-block-editor',
        GURADO_WIDGET_PLUGIN_URL . 'assets/block.js',
        array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-i18n', 'wp-block-editor' ),
        GURADO_WIDGET_VERSION,
        true
    );

    wp_set_script_translations(
        'gwb-block-editor',
        'gurado',
        GURADO_WIDGET_PLUGIN_DIR . 'languages'
    );

    register_block_type( 'gurado/widget', array(
        'api_version'     => 2,
        'editor_script'   => 'gwb-block-editor',
        'title'           => __( 'plugin_title', 'gurado' ),
        'render_callback' => function( $attrs ) {
            gwb_ensure_script_enqueued();
            return gwb_build_gurado_tag( $attrs );
        },
        'attributes'      => array(
            'shop'    => array( 'type' => 'string', 'default' => '' ),
            'mode'    => array( 'type' => 'string', 'default' => 'bubble' ),
            'page'    => array( 'type' => 'string', 'default' => '' ),
            'align'   => array( 'type' => 'string', 'default' => '' ),
            'offsetX' => array( 'type' => 'string', 'default' => '' ),
            'offsetY' => array( 'type' => 'string', 'default' => '' ),
            'product' => array( 'type' => 'string', 'default' => '' ),
        ),
        'supports'        => array( 'html' => false ),
    ) );
}
add_action( 'init', 'gwb_register_block' );
