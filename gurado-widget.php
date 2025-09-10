<?php
/**
 * Plugin Name: Gurado Widget Block & Shortcode
 * Description: Gutenberg-Block + Shortcode für das Gurado-Gutschein-Widget. Lädt das Widget-Script automatisch vor </body>.
 * Version:     1.0.1
 * Author:      (dein Name)
 * License:     GPL-2.0-or-later
 * Text Domain: gurado-widget
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'GURADO_WIDGET_VERSION', '1.0.1' );
define( 'GURADO_WIDGET_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'GURADO_WIDGET_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Frontend-Script registrieren (Gurado Widget)
 */
function gwb_register_frontend_script() {
    $base = 'guradoapi.oveleon.com/dist/widget.js';
    $src  = is_ssl() ? "https://{$base}" : "http://{$base}";

    wp_register_script(
        'gurado-widget',
        $src,
        array(),
        null,   // vom Anbieter verwaltet
        true    // in_footer => vor </body>
    );
}
add_action( 'init', 'gwb_register_frontend_script' );

function gwb_build_gurado_tag( $attrs ) {
    $defaults = array(
        'name'   => '',
        'lang'   => 'de',
        'mode'   => 'bubble',
        'align'  => '',
        'key'    => '',
        'client' => '',
    );
    $a = wp_parse_args( (array) $attrs, $defaults );

    $name   = trim( wp_strip_all_tags( (string) $a['name'] ) );
    $lang   = trim( wp_strip_all_tags( (string) $a['lang'] ) );
    $mode   = trim( wp_strip_all_tags( (string) $a['mode'] ) );
    $align  = trim( wp_strip_all_tags( (string) $a['align'] ) );
    $key    = trim( (string) $a['key'] );
    $client = trim( (string) $a['client'] );

    if ( $key === '' || $client === '' ) {
        return '<div class="gwb-notice" style="color:#b11;">Gurado-Widget: Bitte „key“ und „client“ konfigurieren.</div>';
    }

    if ( ! in_array( $mode, array( 'bubble', 'embedded' ), true ) ) {
        $mode = 'bubble';
    }

    $attrs_html = array(
        'key="'    . esc_attr( $key )    . '"',
        'client="' . esc_attr( $client ) . '"',
    );
    if ( $name !== '' )  $attrs_html[] = 'name="'  . esc_attr( $name )  . '"';
    if ( $lang !== '' )  $attrs_html[] = 'lang="'  . esc_attr( $lang )  . '"';
    if ( $mode !== '' )  $attrs_html[] = 'mode="'  . esc_attr( $mode )  . '"';
    if ( $align !== '' ) $attrs_html[] = 'align="' . esc_attr( $align ) . '"';

    return '<gurado-widget ' . implode( ' ', $attrs_html ) . '></gurado-widget>';
}

function gwb_ensure_script_enqueued() {
    if ( ! wp_script_is( 'gurado-widget', 'enqueued' ) ) {
        wp_enqueue_script( 'gurado-widget' );
    }
}

function gwb_shortcode( $atts = array() ) {
    gwb_ensure_script_enqueued();
    return gwb_build_gurado_tag( $atts );
}
add_shortcode( 'gurado_widget', 'gwb_shortcode' );

/**
 * Gutenberg-Block registrieren (Editor-Script mit korrekten Deps!)
 */
function gwb_register_block() {
    wp_register_script(
        'gwb-block-editor',
        GURADO_WIDGET_PLUGIN_URL . 'assets/block.js',
        array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-i18n', 'wp-block-editor' ),
        GURADO_WIDGET_VERSION,
        true
    );

    register_block_type( 'gurado/widget', array(
        'api_version'     => 2,
        'editor_script'   => 'gwb-block-editor',
        'render_callback' => function( $attrs ) {
            gwb_ensure_script_enqueued();
            return gwb_build_gurado_tag( $attrs );
        },
        'attributes'      => array(
            'name'   => array( 'type' => 'string', 'default' => '' ),
            'lang'   => array( 'type' => 'string', 'default' => 'de' ),
            'mode'   => array( 'type' => 'string', 'default' => 'bubble' ),
            'align'  => array( 'type' => 'string', 'default' => '' ),
            'key'    => array( 'type' => 'string', 'default' => '' ),
            'client' => array( 'type' => 'string', 'default' => '' ),
        ),
        'supports'        => array( 'html' => false ),
    ) );
}
add_action( 'init', 'gwb_register_block' );
