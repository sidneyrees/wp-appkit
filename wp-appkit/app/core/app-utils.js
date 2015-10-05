define( function( require ) {

	"use strict";

	var _ = require( 'underscore' );
	var Config = require( 'root/config' );

	/**
	 * Used in debug mode to memorize log messages history
	 * @type Array
	 */
	var logs = [];

	var utils = { };

	utils.log = function() {
		if ( Config.debug_mode == 'on' ) {
			utils.logForced.apply( utils, arguments );
		}
	};
	
	utils.logForced = function() {
		
		if ( console ) {
			console.log.apply( console, arguments );
		}

		_.each( arguments, function( item ) {
			if ( logs.length >= 100 ) {
				logs.shift();
			}
			if (typeof item == 'object') {
				//This makes to long log outputs!!
				//TODO : see if we could find an elegant way to display objects
				//logs.push( ( JSON && JSON.stringify ? JSON.stringify(item) : item ) );
			} else {
				logs.push( item );
			}
		} );
		
	}
	
	utils.getLogs = function() {
		return logs.slice(0); //Return a clone of the local array
	};

	utils.addParamToUrl = function( uri, key, value ) {
		var new_url = '';
		var re = new RegExp( "([?&])" + key + "=.*?(&|$)", "i" );
		var separator = uri.indexOf( '?' ) !== -1 ? "&" : "?";
		if ( uri.match( re ) ) {
			new_url = uri.replace( re, '$1' + key + "=" + value + '$2' );
		} else {
			new_url = uri + separator + key + "=" + value;
		}
		return new_url;
	};
	
	utils.getAjaxErrorType = function( jqXHR, textStatus, errorThrown ) {
		var error_type = 'unknown-error';
		
		textStatus = ( textStatus !== null ) ? textStatus : 'unknown';
		
		switch( jqXHR.status ) {
			case 404:
				if ( textStatus == 'error' ) {
					error_type = 'url-not-found';
				} else {
					error_type = '404:' + textStatus; 
				}
				break;
			case 200:
				if ( textStatus == 'parsererror' ) {
					error_type = 'parse-error-in-json-answer';
				} else {
					error_type = '200:' + textStatus;
				}
				break;
			default:
				error_type = jqXHR.status + ':' + textStatus;
				break;
		}
		
		return error_type;
	};

	return utils;
} );