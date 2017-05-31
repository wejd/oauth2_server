var models = require('./../models');
var config = require('./../config/dbconfig.json');


var pg = require('pg');
pg.defaults.ssl = true;
var conString = config.App.conString;

var CryptoJS = require("crypto-js");

var cryptoConfig = require('./../config/cryptConf')


/**
 * add client is a function that add a client
 * to the database
 * @param req
 * @param res
 *
 */
var addclient = function(client, cb) {


    models.client.create(client).then(function(clientCreated) {

        return cb(clientCreated)


    });



};

/**
 * this function delete a client and take in parameter his id
 * @param data
 */
var deleteclient = function(idclient, cb) {

    models.client.findOne({ where: { id: idclient } }).then(function(client) {

        cb(client.destroy());
    });
};
/**
 * function that updates   a client
 * @param idclient
 * @param client
 */
var updateclient = function(idclient, client, cb) {
    console.log(idclient)
    models.client.findOne({
        where: {
            id: idclient
        }
    }).then(function(clientToUpdate) {

        clientToUpdate.update(client).then(function(clientAfterUpdate) {

            cb(clientAfterUpdate.dataValues)
        })
    });

}

/**
 * function that updates   a client and set a picture to it
 * @param idclient
 * @param client
 */
var updateclientWithApicture = function(idclient, picture_url, cb) {
    console.log(idclient)
    models.client.findOne({
        where: {
            id: idclient
        }
    }).then(function(clientToUpdate) {
        clientToUpdate.picture_url = picture_url;

        cb(clientToUpdate.update(clientToUpdate.dataValues).then(function() {}))
    });

}


/**
 * function that return all clients
 * @param cb
 */
var getAllclient = function(cb) {
    console.log('Outside pg connect')
    pg.connect(conString, function(err, dbclient, ok) {

        if (err) {

            return console.error('could not connect to the database ' + err);
        }

        dbclient.query("SELECT * FROM clients ", function(err, rows) {
            if (err) {
                console.log('erruer', err)
            }

            return cb(rows.rows);

        });

        ok();
    });


}


/**
 * function that return a client by their id
 * @param idManager
 */
var getclientById = function(idclient, cb) {

    models.client.findOne({ where: { id: idclient } }).then(function(clientfound) {

        return cb(clientfound.dataValues);
    })

}



exports.deleteclient = deleteclient;
exports.addclient = addclient;
exports.updateclient = updateclient;
exports.getAllclient = getAllclient;
exports.getclientById = getclientById;