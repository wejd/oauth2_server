var models = require('./../models');
var config = require('./../config/dbconfig.json');


var pg = require('pg');

var conString = config.App.conString;
pg.defaults.ssl = true;
var CryptoJS = require("crypto-js");

var cryptoConfig = require('./../config/cryptConf')


/**
 * add user is a function that add a user
 * to the database
 * @param req
 * @param res
 *
 */
var adduser = function(user, cb) {

    user.password = CryptoJS.AES.encrypt(user.password, cryptoConfig.cryptKey).toString();
    console.log(user)

    models.user.create(user).then(function(userCreated) {
        return cb(userCreated)
    });


};
var verifyPassword = function(user, password, callback) {
    getuserById(user.id, function(userFound) {
        if (userFound) {
            if (!((CryptoJS.AES.decrypt(userFound.password.toString(), cryptoConfig.cryptKey).toString(CryptoJS.enc.Utf8)) == password)) {
                console.log('password mismatch');
                callback(false)

            } else {
                callback(true)
            }

        } else {
            callback(false)
        }

    })

}

/**
 * this function delete a user and take in parameter his id
 * @param data
 */
var deleteuser = function(iduser, cb) {

    models.user.findOne({ where: { id: iduser } }).then(function(user) {

        cb(user.destroy());
    });
};
/**
 * function that updates   a user
 * @param iduser
 * @param user
 */
var updateuser = function(iduser, userModified, cb) {
    console.log(iduser)
    models.user.findOne({
        where: {
            id: iduser
        }
    }).then(function(userToUpdate) {

        userToUpdate.update(userModified).then(function(userAfterUpdate) {

            cb(userAfterUpdate.dataValues)
        })
    });

}



/**
 * function that return all users
 * @param cb
 */
var getAlluser = function(cb) {
    console.log('Outside pg connect')
    pg.connect(conString, function(err, dbclient, ok) {

        if (err) {

            return console.error('could not connect to the database ' + err);
        }

        dbclient.query("SELECT * FROM users ", function(err, rows) {
            if (err) {
                console.log('erruer', err)
            }

            return cb(rows.rows);

        });

        ok();
    });


}


/**
 * function that return a user by their id
 * @param idManager
 */
var getuserById = function(iduser, cb) {

    models.user.findOne({ where: { id: iduser } }).then(function(userfound) {

        return cb(userfound.dataValues);
    })

}


exports.deleteuser = deleteuser;
exports.adduser = adduser;
exports.updateuser = updateuser;
exports.getAlluser = getAlluser;
exports.getuserById = getuserById;
exports.verifyPassword = verifyPassword;