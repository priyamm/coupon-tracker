'use strict';

var Alexa = require('alexa-sdk');
var stateHandlers = require('./stateHandlers');
var constants = require('./constants')

exports.handler = function(event, context, callback) {
    // if(event.session.application.applicationId != constants.appId)
    //   return callback(new Error('Invalid Appliation Id'))
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = event.session.application.applicationId;
    alexa.registerHandlers(stateHandlers);
    alexa.execute();
};
