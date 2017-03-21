<?php

require_once( dirname( __FILE__ ) .'/core-wp-api-routes/synchronization.php' );

function wpak_register_wp_api_routes() {
    $synchronization = new Wpak_Route_Synchronization();
    $synchronization->register_routes();
}

add_action( 'rest_api_init', 'wpak_register_wp_api_routes' );
