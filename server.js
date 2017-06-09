// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var speakerController = require('./controllers/speaker');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');
/**
 *  part 1- launch database creation and add some data
 */
var models = require('./models');
var initSchema = function() {
    models.user.create({ username: 'wejd', password: "U2FsdGVkX19Upph/T+cWdbnxAFEfZAUPfGTU1n0MXko=" });
    models.client.create({ name: 'alexa', idClient: 'alexa_id', secret: "alexa", userId: 1 });
    models.speaker.create({ name: 'office', type: 'arpegio', num_serie: "123", userId: 1 });
}
var lunchDatabaseCreationForce = function() {
    models.sequelize.sync({ force: true }).then(function() { // in case we need to reload database config
        console.log('tables created');
        initSchema();
        console.log('rows created');
    });
}


/**
 *  part1 - ends
 */


// Create our Express application
var app = express();

// Set view engine to ejs
app.set('view engine', 'ejs');

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Use express session support since OAuth2orize requires it
app.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true
}));

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();
router.get('/initdb', function(req, res, next) {
    lunchDatabaseCreationForce();
    res.send({ status: 'ok' })
})

router.post('/addNewUser', function(req, res, next) {

    var user = {
        username: req.body.username,
        password: req.body.password
    }
    userController.adduser(user, function(userAdded) {

        /* models.client.create({ name: 'alexa', idClient: 'alexa_id', secret: "alexa", userId: userAdded.id });*/
        console.log('uer Added')
        res.send({ status: 'ok' })
    })


})
router.post('/login', function(req, res, next) {
    models.user.findOne({ where: { username: req.body.username } }).then(function(user) {

        if (!user) { return res.send(false) }

        // No user found with that username
        if (!user) { res.send(false) }
        user = user.dataValues
            // Make sure the password is correct
        userController.verifyPassword(user, req.body.password, function(isMatch) {


            // Password did not match
            if (!isMatch) { return res.send(false) }

            // Success
            return res.send(user);
        });
    });


})

router.post('/updateSpeakerByNumSerie', function(req, res, next) {

    speakerController.updatespeakerByNumSerie(req.body.num_serie, req.body.linked, function(speakerupdated) {
        if (speakerupdated) {
            res.send(true);
        } else {
            res.send(false)
        }

    })

})

router.post('/deleteSpeakerByNumSerie', function(req, res, next) {

    speakerController.deletespeakerByNumSerie(req.body.num_serie, function(speakerdeleted) {
        if (speakerdeleted) {
            res.send(true);
        } else {
            res.send(false)
        }

    })

})
var http = require('bluebird').promisifyAll(require('request'), { multiArgs: true });
router.get('/linkspeaker', authController.isAuthenticated, function(req, res, next) {
    var namespeakerfromalexa = req.body.key
    console.log(req.user)
    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {

            if (speaker.name == namespeakerfromalexa) {
                console.log('speaker nbame', namespeakerfromalexa)

                http.postAsync({ url: 'http://vps341573.ovh.net:5050/', json: true, form: { key: speaker.num_serie } }).spread(

                    function(error, body) {



                        if (body == 'found') {

                            console.log('found')
                            res.send({ result: 'found' })


                        } else {

                            console.log('unabble to linik');

                            res.send({ result: 'not found' })


                        }


                    });





            } else {

                http.postAsync({ url: 'http://vps341573.ovh.net:5050/unlinkspeaker', json: true, form: { key: speaker.num_serie } }).spread(

                    function(error, body) {





                    });

            }



        })


    })

})

router.get('/playtrack', authController.isAuthenticated, function(req, res, next) {
    i = 0;
    j = 0
    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {
            i++;
            if (speaker.linked == true) {
                j++;
                http.postAsync({ url: 'http://vps341573.ovh.net:5050/playtrack', json: true, form: { key: speaker.num_serie } }).spread(
                    function(error, body) {
                        if (body == 'no') {
                            res.send({ result: 'not found' })
                        } else {

                            res.send({ result: 'found' })
                        }
                    });
            }
            if (i == listSpeaker.length - 1) {
                if (j == 0) {
                    res.send({ result: 'not found' })
                }
            }
        })
    })
})

router.get('/playnext', authController.isAuthenticated, function(req, res, next) {
    i = 0;
    j = 0
    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {
            i++;
            if (speaker.linked == true) {
                j++;

                http.postAsync({ url: 'http://vps341573.ovh.net:5050/playnext', json: true, form: { key: speaker.num_serie } }).spread(

                    function(error, body) {


                        if (body == 'no') {


                            res.send({ result: 'not found' })


                        } else {



                            res.send({ result: 'found' })


                        }


                    });





            }
            if (i == listSpeaker.length - 1) {
                if (j == 0) {
                    res.send({ result: 'not found' })
                }
            }



        })


    })



})
router.get('/pause', authController.isAuthenticated, function(req, res, next) {
    i = 0;
    j = 0
    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {
            i++;
            if (speaker.linked == true) {

                j++;
                http.postAsync({ url: 'http://vps341573.ovh.net:5050/pause', json: true, form: { key: speaker.num_serie } }).spread(

                    function(error, body) {


                        if (body == 'no') {


                            res.send({ result: 'not found' })


                        } else {



                            res.send({ result: 'found' })


                        }


                    });





            }
            if (i == listSpeaker.length - 1) {
                if (j == 0) {
                    res.send({ result: 'not found' })
                }
            }



        })


    })



})

router.get('/playprevious', authController.isAuthenticated, function(req, res, next) {
    i = 0;
    j = 0
    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {
            i++;
            if (speaker.linked == true) {
                j++;

                http.postAsync({ url: 'http://vps341573.ovh.net:5050/playprevious', json: true, form: { key: speaker.num_serie } }).spread(

                    function(error, body) {


                        if (body == 'no') {


                            res.send({ result: 'not found' })


                        } else {



                            res.send({ result: 'found' })


                        }


                    });





            }
            if (i == listSpeaker.length - 1) {
                if (j == 0) {
                    res.send({ result: 'not found' })
                }
            }



        })


    })



})
router.get('/incrvolume', authController.isAuthenticated, function(req, res, next) {
    i = 0;
    j = 0
    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {

            if (speaker.linked == true) {


                http.postAsync({ url: 'http://vps341573.ovh.net:5050/incrvolume', json: true, form: { key: speaker.num_serie } }).spread(

                    function(error, body) {


                        if (body == 'no') {


                            res.send({ result: 'not found' })


                        } else {



                            res.send({ result: 'found' })


                        }


                    });





            }
            if (i == listSpeaker.length - 1) {
                if (j == 0) {
                    res.send({ result: 'not found' })
                }
            }



        })


    })



})
router.get('/decrevolume', authController.isAuthenticated, function(req, res, next) {
    i = 0;
    j = 0

    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {
            i++;
            if (speaker.linked == true) {
                j++;

                http.postAsync({ url: 'http://vps341573.ovh.net:5050/decrevolume', json: true, form: { key: speaker.num_serie } }).spread(

                    function(error, body) {


                        if (body == 'no') {


                            res.send({ result: 'not found' })


                        } else {



                            res.send({ result: 'found' })


                        }


                    });





            }
            if (i == listSpeaker.length - 1) {
                if (j == 0) {
                    res.send({ result: 'not found' })
                }
            }



        })


    })



})
router.get('/increasevolume', authController.isAuthenticated, function(req, res, next) {
    i = 0;
    j = 0
    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {
            i++;
            if (speaker.linked == true) {
                j++;

                http.postAsync({ url: 'http://vps341573.ovh.net:5050/increasevolume', json: true, form: { key: speaker.num_serie, nb: req.body.key } }).spread(

                    function(error, body) {


                        if (body == 'no') {


                            res.send({ result: 'not found' })


                        } else {



                            res.send({ result: 'found' })


                        }


                    });





            }
            if (i == listSpeaker.length - 1) {
                if (j == 0) {
                    res.send({ result: 'not found' })
                }
            }



        })


    })



})
router.get('/decreasevolume', authController.isAuthenticated, function(req, res, next) {
    i = 0;
    j = 0
    speakerController.findSpeakerByOwner(req.user.id, function(listSpeaker) {
        console.log('list speaker ', listSpeaker)
        listSpeaker.forEach(function(speaker) {
            i++;
            if (speaker.linked == true) {
                j++;

                http.postAsync({ url: 'http://vps341573.ovh.net:5050/decreasevolume', json: true, form: { key: speaker.num_serie, nb: req.body.key } }).spread(

                    function(error, body) {


                        if (body == 'no') {


                            res.send({ result: 'not found' })


                        } else {



                            res.send({ result: 'found' })


                        }


                    });





            }
            if (i == listSpeaker.length - 1) {
                if (j == 0) {
                    res.send({ result: 'not found' })
                }
            }



        })


    })



})




router.post('/speakers', authController.isAuthenticated, function(req, res, next) {
    console.log(req.body)

    speaker = {
        name: req.body.name,
        type: req.body.type,
        num_serie: req.body.num_serie,
        userId: req.user.id
    }
    speakerController.addspeaker(speaker, function(result) {
        console.log(result)
        res.send(result)
    })

})
router.get('/speakers', authController.isAuthenticated, function(req, res, next) {

    console.log(req.user)
    speakerController.findSpeakerByOwner(req.user.id, function(result) {
        console.log(result)
        res.send(result)
    })

})
router.get('/speakersb', authController.isBearerAuthenticated, function(req, res, next) {

    speakerController.getAllspeaker(function(result) {
        console.log(result)
        res.send(result)
    })

})

router.get('/oauth2/authorize', authController.isAuthenticated, oauth2Controller.authorization)
router.post('/oauth2/authorize', authController.isAuthenticated, oauth2Controller.decision)

router.post('/oauth2/token', authController.isClientAuthenticated, oauth2Controller.token)


router.get('/privacy', function(req, res, next) {

    res.render('policy')
})

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(process.env.PORT || 3000)