/** 
 * This is not a robust, secure web API. It is just a quick starting point.
 * This is repo is not used in production as a web API (only as a library).
 *
 * See inventory of work to be done here: https://github.com/enketo/enketo-transformer/labels/web-api-only.
 * 
 * PRs are very welcome!
 */

const Promise = require( 'lie' );
const request = require( 'request' );
const express = require( 'express' );
const router = express.Router();
const transformer = require( './transformer' );

router
    .post( '/', ( req, res ) => {
        // NOTE: req.query.xform is an XML string
        if ( req.app.get( 'secure' ) ) {
            res.status( 405 ).send( 'Not Allowed' );
        } else if ( !req.body.xform ) {
            res.status( 400 ).send( 'Bad Request.' );
        } else {
            // allow requests from anywhere
            res.set( 'Access-Control-Allow-Origin', '*' );

            transformer.transform( {
                    xform: req.body.xform,
                    theme: req.body.theme,
                    media: req.body.media,
                    markdown: req.body.markdown !== 'false'
                } )
                .then( result => {
                    res.json( result );
                } )
                .catch( error => {
                    error.status = error.status || 500;
                    error.message = error.message || 'Unknown error.';
                    res.status( error.status ).send( `${error.message} (stack: ${error.stack})` );
                } );
        }
    } );

module.exports = app => {
    app.use( '/transform', router );
};