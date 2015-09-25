/**
* Encapsulates FileSystem and FileTransfer PhoneGap API.
* PhoneGap plugin "cordova-plugin-file" and "cordova-plugin-file-transfer"
* must be added to the project.
*/
define( function( require ) {

	"use strict";

	var _     = require('underscore'),
		Utils = require('core/app-utils'),
		md5 = require( 'core/lib/encryption/md5' );

	var file_api = { };
	
	var file_system = null;
	
	var generate_download_filename = function ( remote_file_url, force_extension ) {
		
		var extension = force_extension ? force_extension : remote_file_url.split('.').pop();
		
		var hash = md5( remote_file_url );
		
		var download_filename = hash + '.' + extension;
		
		return download_filename;
	};
	
	var loadFileSystem = function( cb_ok, cb_error ) {
		if ( file_system === null ) {
			if ( window.requestFileSystem ) {
				window.requestFileSystem( 
					LocalFileSystem.PERSISTENT, 
					0, 
					function ( file_system_found ) {
						file_system = file_system_found;
						Utils.log( 'PhoneGap FileSystem initialized ok' );
						cb_ok();
					}, 
					function ( error ) {
						Utils.log( 'PhoneGap FileSystem API not found : '+ error.code );
						cb_error( error );
					} 
				);
			} else {
				Utils.log( 'PhoneGap FileSystem API not found. Please check that the "org.apache.cordova.file" plugin has been added to your project.' );
				cb_error();
			}
		} else {
			cb_ok();
		}
	};
	
	file_api.download = function ( remote_file_url, options ) {
		
		//Parse options :
		var force_extension = options.hasOwnProperty( 'extension' ) ? options.extension : '';
		var cb_ok = options.hasOwnProperty( 'ok' ) ? options.ok : null;
		var cb_error = options.hasOwnProperty( 'error' ) ? options.error : null;
		var cb_progress_percent = options.hasOwnProperty( 'progress_percent' ) ? options.progress_percent : null;
		var cb_progress_not_computable = options.hasOwnProperty( 'progress_not_computable' ) ? options.progress_not_computable : null;
		
		loadFileSystem( 
			function() {
			
				var download_filename = generate_download_filename( remote_file_url, force_extension );

				var download_file = file_system.root.toURL() + download_filename;

				remote_file_url = encodeURI( remote_file_url );

				var file_transfer = new FileTransfer();

				file_transfer.onprogress = function ( progress_event ) {
					if ( progress_event.lengthComputable ) {
						if ( cb_progress_percent ) {
							cb_progress_percent( Math.round( 100 * progress_event.loaded / progress_event.total ), progress_event.loaded, progress_event.total );
						}
					} else {
						if ( cb_progress_not_computable ) {
							cb_progress_not_computable( progress_event );
						}
					}
				};

				Utils.log( 'Start download', remote_file_url, download_file );

				file_transfer.download(
					remote_file_url,
					download_file,
					function( entry ) {
						Utils.log( 'Download ok : '+ remote_file_url +' to '+ download_file, entry );
						if ( cb_ok ) {
							cb_ok( { 
								entry_uri: entry.toURI(),
								entry_fullpath: entry.fullPath,
								entry: entry
							} );
						}
					},
					function( error ) {
						Utils.log( 'Download error', remote_file_url, download_file, error );
						if ( cb_error ) {
							cb_error( error );
						}
					}
				);
			},
			function() {
				if ( cb_error ) {
					cb_error();
				}
			}
		);
	};
	
	return file_api;
} );


