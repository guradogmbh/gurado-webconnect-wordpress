=== gurado WebConnect ===
Contributors: gurado
Tags: vouchers, gift-cards, tickets, coupons, loyalty
Requires at least: 6.3
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

The one-stop solution for vouchers, tickets, coupons, and loyalty programs. Integrate the gurado widget via block or shortcode.

== Description ==
gurado WebConnect lets you embed the gurado voucher/ticket widget on any page using a Gutenberg block or a shortcode. Configure shop, mode (bubble/embedded), entry page, alignment, offsets and product ID. The plugin enqueues the vendor script once (in footer) and supports full i18n for PHP and JavaScript (wp_set_script_translations).

**Key features**
* Gutenberg block with inspector controls
* Shortcode `[gurado_widget ...]`
* Loads vendor script once in footer
* Configurable attributes: `shop`, `mode`, `page`, `align`, `offsetX`, `offsetY`, `product`
* i18n ready (PHP `.mo` and JS `.json`)

== Installation ==
1. Upload the plugin folder to `/wp-content/plugins/` and activate it.
2. In the editor, insert the block “gurado WebConnect”.
3. Fill **shop** (required) and optional attributes.
4. For Classic Editor use the shortcode:
   `[gurado_widget shop="my-shop" mode="bubble" page="" align="right" offsetX="1rem" offsetY="8px"]`

== Frequently Asked Questions ==
= The widget does not render =
Ensure `shop` is set and the vendor script is reachable over HTTPS.

== Changelog ==
= 1.1.0 =
* Initial public release with block + shortcode and i18n support.
