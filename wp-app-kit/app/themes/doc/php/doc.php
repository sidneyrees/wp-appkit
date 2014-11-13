<?php

function wpak_doc_remove_crayon_highlighter(){
	if( class_exists('CrayonWP') ){
		remove_filter('the_posts', 'CrayonWP::the_posts', 100);
		remove_filter('the_content', 'CrayonWP::the_content', 100);
	}
}

add_action('wpak_before_component_page','wpak_doc_remove_crayon_highlighter');

