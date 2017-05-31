var models = require('./../models');
var config = require('./../config/dbconfig.json');


var pg = require('pg');
pg.defaults.ssl = true;
var conString = config.App.conString;

var CryptoJS = require("crypto-js");

var cryptoConfig = require('./../config/cryptConf')


/**
 * add code is a function that add a code
 * to the database
 * @param req
 * @param res
 *
 */
var addcode = function(code, cb) {


    models.code.create(code).then(function(codeCreated) {

        return cb(codeCreated)


    });



};

/**
 * this function delete a code and take in parameter his id
 * @param data
 */
var deletecode = function(idcode, cb) {

    models.code.findOne({ where: { id: idcode } }).then(function(code) {

        cb(code.destroy());
    });
};
/**
 * function that updates   a code
 * @param idcode
 * @param code
 */
var updatecode = function(idcode, code, cb) {
    console.log(idcode)
    models.code.findOne({
        where: {
            id: idcode
        }
    }).then(function(codeToUpdate) {

        codeToUpdate.update(code).then(function(codeAfterUpdate) {

            cb(codeAfterUpdate.dataValues)
        })
    });

}



/**
 * function that return all codes
 * @param cb
 */
var getAllcode = function(cb) {
    console.log('Outside pg connect')
    pg.connect(conString, function(err, dbclient, ok) {

        if (err) {

            return console.error('could not connect to the database ' + err);
        }

        dbclient.query("SELECT * FROM codes ", function(err, rows) {
            if (err) {
                console.log('erruer', err)
            }

            return cb(rows.rows);

        });

        ok();
    });


}


/**
 * function that return a code by their id
 * @param idManager
 */
var getcodeById = function(idcode, cb) {

    models.code.findOne({ where: { id: idcode } }).then(function(codefound) {

        return cb(codefound.dataValues);
    })

}



exports.deletecode = deletecode;
exports.addcode = addcode;
exports.updatecode = updatecode;
exports.getAllcode = getAllcode;
exports.getcodeById = getcodeById;