var models = require('./../models');
var config = require('./../config/dbconfig.json');


var pg = require('pg');
pg.defaults.ssl = true;
var conString = config.App.conString;

var CryptoJS = require("crypto-js");

var cryptoConfig = require('./../config/cryptConf')


/**
 * add token is a function that add a token
 * to the database
 * @param req
 * @param res
 *
 */
var addtoken = function(token, cb) {


    models.token.create(token).then(function(tokenCreated) {

        return cb(tokenCreated)


    });



};

/**
 * this function delete a token and take in parameter his id
 * @param data
 */
var deletetoken = function(idtoken, cb) {

    models.token.findOne({ where: { id: idtoken } }).then(function(token) {

        cb(token.destroy());
    });
};
/**
 * function that updates   a token
 * @param idtoken
 * @param token
 */
var updatetoken = function(idtoken, token, cb) {
    console.log(idtoken)
    models.token.findOne({
        where: {
            id: idtoken
        }
    }).then(function(tokenToUpdate) {

        tokenToUpdate.update(token).then(function(tokenAfterUpdate) {

            cb(tokenAfterUpdate.dataValues)
        })
    });

}



/**
 * function that return all tokens
 * @param cb
 */
var getAlltoken = function(cb) {
    console.log('Outside pg connect')
    pg.connect(conString, function(err, dbclient, ok) {

        if (err) {

            return console.error('could not connect to the database ' + err);
        }

        dbclient.query("SELECT * FROM tokens ", function(err, rows) {
            if (err) {
                console.log('erruer', err)
            }

            return cb(rows.rows);

        });

        ok();
    });


}


/**
 * function that return a token by their id
 * @param idManager
 */
var gettokenById = function(idtoken, cb) {

    models.token.findOne({ where: { id: idtoken } }).then(function(tokenfound) {

        return cb(tokenfound.dataValues);
    })

}



exports.deletetoken = deletetoken;
exports.addtoken = addtoken;
exports.updatetoken = updatetoken;
exports.getAlltoken = getAlltoken;
exports.gettokenById = gettokenById;