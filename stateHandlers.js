'use strict'

const Alexa = require('alexa-sdk');
const apiClient = require('./apiClient');
const Messages = require('./Messages');

var cityName;
var couponList;
var coupon;
var stateHandlers = {

        'LaunchRequest': function() {
          this.emit(':ask', Messages.WELCOME,
                      'You haven\'t replied anything.');
        },

        'CityIntent': function() {
          var city = this.event.request.intent.slots.city.value;
          console.log('City Name : ' + city);
          if(!city)
            this.emit(':ask', "Sorry, I didn't get that city. Try again?", 'Sorry, didn\'t hear from you.');
            // apiClient.couponApi(city, data => {
            //
            // });
            cityName = city;
            this.emit(':ask', 'Is it ' + city + ' ? Please confirm.', 'You haven\'t replied anything. Is it ' + city + ' ? Please confirm.');

        },
        'YesIntent': function() {
          console.log('Yes Intent : ' + cityName);
          if(!cityName)
            this.emit(':ask', 'Please tell your city name', 'You didn\'t answered.');
          var message = 'Here are the coupons for city ' + cityName + '...';
                        // ' You can interrupt me asking what is the coupon code, address, phone number of the coupons after selecting the coupon. ... ...';
          apiClient.currentCouponAPI(data => {
            var filteredData = data.filter(leaf => {
              return leaf.city===cityName;
            });
            couponList = filteredData;
            if(!couponList || couponList.length === 0)
              this.emit(':ask', 'Thers is no coupon for your city. Try another city', 'You didn\'t answered.');
            else {
              var count = filteredData.length;
              message += filteredData.reduce((msg, one)=>{
                return msg + 'Coupon Number ' + (filteredData.indexOf(one) + 1) + '...' + one.coupon_title + '...';
              }, '');
              message += ' . Select one of the above coupons.'
              this.emit(':ask', message, 'You didn\'t answered.');
            }
          });
        },
        'NoIntent' : function() {
          this.emit(':ask', 'Which city are you from', 'You didn\'t answered.');
        },
        'SelectionIntent': function() {
          var number = this.event.request.intent.slots.number.value;
          console.log('number' + number);
          if(!number || number===0 || (number > couponList.length + 1))
            this.emit(':tell', 'You have choosen an invalid coupon number.')
          else {
            coupon = couponList[number - 1];
            var message = 'Your coupon ' + coupon.coupon_title + ' ... ' +
            'coupon code is ...' + '<say-as interpret-as="spell-out">' + coupon.coupon_code + '</say-as>' + ' ... ' +
            'phone number is ...' + '<say-as interpret-as="digits">' + coupon.phone + '</say-as>' + ' ... ' +
            'address is ...' + coupon.address + ' ... ' + 'expiring on ... ' +
            coupon.expiring_date;
            this.emit(':tell', message);
          }
        },
        'CouponIntent': function() {
          console.log('Coupon Intent : ' + cityName);
          if(!coupon)
          this.emit(':tell', 'You haven\'t selected any coupon');
          var message = 'The coupon code is ... ' + '<say-as interpret-as="spell-out">' + coupon.coupon_code + '</say-as>';
          this.emit(':tell', message);
        },
        'PhoneIntent': function() {
          console.log('Phone Intent : ' + cityName + '\nCoupon' + coupon);
          if(!coupon)
          this.emit(':tell', 'You haven\'t selected any coupon');
          var message = 'The phone number is ... ' + '<say-as interpret-as="digits">' + coupon.phone + '</say-as>';
          this.emit(':tell', message);
        },


        'AMAZON.HelpIntent': function() {
          var message = Messages.HELP;
          this.emit(':tell', message);
      },

      'AMAZON.StopIntent': function() {
          var message = 'Find out more at one indya.com/cuponsninja. Goodbye.';
          this.emit(':tell', message);
      },

      'SessionEndedRequest': function () {
          console.log('session ended!');
          this.attributes['endedSessionCount'] += 1;
          this.emit(':tell', 'Thank you for you coupon search. Come back again!!');
      },

      'Unhandled': function() {
          // var message = 'Sorry, I didn\'t get that. I\'m sorry. This is not something I know very much about in this skill.';
          // this.emit(':ask', message, message);
          var message = 'Sorry, I could not understand.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
      }
};

module.exports = stateHandlers;
