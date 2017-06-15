// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var pg = require('pg');
pg.defaults.ssl = true;
var config = require('./../config/dbconfig.json');
var conString = config.App.conString;
var models = require('./../models');
var userService = require('./user')
passport.serializeUser(function(user, done) {


    done(null, user); //for admn auth
});



// used to deserialize the user
passport.deserializeUser(function(user, done) {
    pg.connect(conString, function(err, dbclient, ok) {

        if (err) {
            return console.error('could not connect to the database ' + err);
        }


        dbclient.query("select * from users where id = $1", [user.id], function(err, rows) { //for admn auth

            done(err, rows.rows[0]);

        });

        ok(); //release to the pool
    });
});
passport.use(new BasicStrategy(
    function(username, password, callback) {
        console.log('inside isAuthenticated')
        models.user.findOne({ where: { username: username } }).then(function(user) {

            if (!user) { return callback(false); }

            // No user found with that username
            if (!user) { return callback(null, false); }
            user = user.dataValues
                // Make sure the password is correct
            userService.verifyPassword(user, password, function(isMatch) {


                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, user);
            });
        });
    }
));

passport.use('client-basic', new BasicStrategy(
    function(username, password, callback) {
        models.client.findOne({ where: { idClient: username } }).then(function(client) {
            if (!client) { return callback(false); }

            // No client found with that id or bad password
            if (!client || client.secret !== password) { return callback(null, false); }

            // Success
            return callback(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, callback) {
        console.log('inside bearer ')
        models.token.findOne({ where: { value: accessToken } }).then(function(token) {
            if (!token) { return callback(false); }

            // No token found
            if (!token) { return callback(null, false); }

            models.user.findOne({ where: { id: token.userId } }).then(function(user) {
                if (!user) { return callback(false); }

                // No user found
                if (!user) { return callback(null, false); }

                // Simple example with no scope
                callback(null, user, { scope: '*' });
            });
        });
    }
));

passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        models.user.findOne({ where: { username: req.body.username } }).then(function(user) {

            if (!user) { return done(false) }

            // No user found with that username
            if (!user) { done(false) }
            user = user.dataValues
                // Make sure the password is correct
            userService.verifyPassword(user, req.body.password, function(isMatch) {


                // Password did not match
                if (!isMatch) { return done(false) }

                // Success

                return done(user)


            })
        })

    }))




exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
exports.isLocalStategie = passport.authenticate('local-login', { session: true });