<?php

class Wpak_Route_Synchronization extends WP_REST_Controller {

	public function register_routes() {

		register_rest_route( 'wp-appkit/v1', '/synchronization', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args' => array()
			)
		) );
	}

	/**
	 * Get a collection of items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {

		$app_id = WpakApps::get_app_id( $app_id );

		$answer = WpakComponents::get_components_synchro_data( $app_id );

		return new WP_REST_Response( $answer, 200 );
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		//return true; <--use to make readable by all
		return true; // current_user_can('edit_something');
	}

}
