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
}
var lunchDatabaseCreationForce = function() {
    models.sequelize.sync({ force: true }).then(function() { // in case we need to reload database config
        console.log('tables created');
        initSchema();
        console.log('rows created');
    });
}

//lunchDatabaseCreationForce()
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
router.post('/speakers', authController.isAuthenticated, function(req, res, next) {
    console.log(req.body)

    speaker = {
        name: req.body.name,
        type: req.body.type,
        quantity: req.body.quantity,
        userId: req.user.id
    }
    speakerController.addspeaker(speaker, function(result) {
        console.log(result)
        res.send(result)
    })

})
router.get('/speakers', authController.isAuthenticated, function(req, res, next) {

    speakerController.getAllspeaker(function(result) {
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




// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(process.env.PORT || 3000)