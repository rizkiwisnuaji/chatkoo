/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var crypto = require( 'crypto' ),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt( text ) {
    var cipher = crypto.createCipher( algorithm, password )
    var crypted = cipher.update( text, 'utf8', 'hex' )
    crypted += cipher.final( 'hex' );
    return crypted;
}

function decrypt( text ) {
    var decipher = crypto.createDecipher( algorithm, password )
    var dec = decipher.update( text, 'hex', 'utf8' )
    dec += decipher.final( 'utf8' );
    return dec;
}


module.exports = {

    index: function(req, res) {
        var data = req.params.all();
        if ( req.isSocket && req.method === 'POST' ) {
            if ( data.message != '' ) {

                Chat.query('INSERT into `chat` (`user`,`message`) VALUES ("' + data.user + '","' + data.message + '")', function( err, rows ) {
                    if ( err ) {
                        sails.log( err );
                        sails.log( "Error occurred in database operation") ;
                    } else {
                        Chat.publishCreate( { id: rows.insertId, message: data.message, user: data.user } );
                    }
                });

            } else {

                sails.log( "Error occurred : Messages cannot be empty !" );

            }
        } else if ( req.isSocket ) {
            Chat.watch( req.socket );
            sails.log( 'New user connected to ' + req.socket.id );
        }

        if ( req.method === 'GET' ) {
            Chat.query( 'SELECT user, message FROM `chat`', function( err, rows ) {
                if ( err ) {
                    sails.log( err) ;
                    sails.log( "Error occurred in database operation" );
                } else {
                	// sails.log( rows );
                    res.send( rows );
                }
            });
        }
    }

};