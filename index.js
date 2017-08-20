'use strict';

var Alexa = require('alexa-sdk');
var stateHandlers = require('./stateHandlers');
var constants = require('./constants')

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = constants.appId;
    alexa.registerHandlers(stateHandlers);
    alexa.execute();
};
