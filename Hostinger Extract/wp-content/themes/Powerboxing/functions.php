<?php
function power_boxing_enqueue_styles() {
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@300;400;700&display=swap', false);
    wp_enqueue_style('style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'power_boxing_enqueue_styles');
