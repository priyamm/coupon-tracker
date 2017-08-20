'use strict';

const request = require('request-promise');
const constants = require('./constants');

let currentCouponAPI = (callback) => {
  console.log('Calling Current Coupon API');
  request({
    "method":"GET",
    "uri": constants.currentCouponAPI,
    "json": true,
    "headers": {
      "User-Agent": "Request-Promise"
    }
  }).then(function (res) {
      callback(res.DATA);
  },function (err) {
    console.log(err);
});
};

let upcomingCouponAPI = (callback) => {
  console.log('Calling Upcoming Coupon API');
  request({
    "method":"GET",
    "uri": consatnts.upcomingCouponAPI,
    "json": true,
    "headers": {
      "User-Agent": "Request-Promise"
    }
  }).then(function (res) {
      callback(res.DATA);
  },function (err) {
    console.log(err);
});
};

module.exports = {currentCouponAPI, upcomingCouponAPI};
