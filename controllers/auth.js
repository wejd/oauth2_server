// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var pg = require('pg');
var config = require('./../config/dbconfig.json');
var conString = config.App.conString;
var models = require('./../models');
var userService = require('./user')

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

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });