var models = require('./../models');
var config = require('./../config/dbconfig.json');


var pg = require('pg');
pg.defaults.ssl = true;
var conString = config.App.conString;

var CryptoJS = require("crypto-js");

var cryptoConfig = require('./../config/cryptConf')


/**
 * add speaker is a function that add a speaker
 * to the database
 * @param req
 * @param res
 *
 */
var addspeaker = function(speaker, cb) {


    models.speaker.create(speaker).then(function(speakerCreated) {

        return cb(speakerCreated)


    });



};

/**
 * this function delete a speaker and take in parameter his id
 * @param data
 */
var deletespeaker = function(idspeaker, cb) {

    models.speaker.findOne({ where: { id: idspeaker } }).then(function(speaker) {

        cb(speaker.destroy());
    });
};
/**
 * function that updates   a speaker
 * @param idspeaker
 * @param speaker
 */
var updatespeaker = function(idspeaker, speaker, cb) {
    console.log(idspeaker)
    models.speaker.findOne({
        where: {
            id: idspeaker
        }
    }).then(function(speakerToUpdate) {

        speakerToUpdate.update(speaker).then(function(speakerAfterUpdate) {

            cb(speakerAfterUpdate.dataValues)
        })
    });

}



/**
 * function that return all speakers
 * @param cb
 */
var getAllspeaker = function(cb) {
    console.log('Outside pg connect')
    pg.connect(conString, function(err, dbclient, ok) {

        if (err) {

            return console.error('could not connect to the database ' + err);
        }

        dbclient.query("SELECT * FROM speakers ", function(err, rows) {
            if (err) {
                console.log('erruer', err)
            }

            return cb(rows.rows);

        });

        ok();
    });


}


/**
 * function that return a speaker by their id
 * @param idManager
 */
var getspeakerById = function(idspeaker, cb) {

    models.speaker.findOne({ where: { id: idspeaker } }).then(function(speakerfound) {

        return cb(speakerfound.dataValues);
    })

}

/**
 * function that updates   a speaker
 * @param idspeaker
 * @param speaker
 */
var updatespeakerByNumSerie = function(numeSerie, val, cb) {

    models.speaker.findOne({
        where: {
            num_serie: numeSerie
        }
    }).then(function(speakerToUpdate) {

        speakerToUpdate.update({ linked: val }).then(function(speakerAfterUpdate) {

            cb(speakerAfterUpdate.dataValues)
        })
    });

}


exports.deletespeaker = deletespeaker;
exports.addspeaker = addspeaker;
exports.updatespeaker = updatespeaker;
exports.getAllspeaker = getAllspeaker;
exports.getspeakerById = getspeakerById;
exports.updatespeakerByNumSerie = updatespeakerByNumSerie;