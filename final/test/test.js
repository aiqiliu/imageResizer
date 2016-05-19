var expect = require("chai").expect;
var assert = require("chai").assert;
var gm = require('gm')
            .subClass({ imageMagick: true });
var sizeOf = require('image-size');
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var s3 = new AWS.S3();
var fs = require('fs');
var request = require('request');
var http = require('http');
var async = require('async');
// var app = require('../exports.js');
// var context = {};
// var callback = {};
// var event = {
//       netid: "123456",
//       width: 200
// };
// app.exports.handler(event, context, callback);

// describe('func category', function () {
//   it('300 -> 500, 800 -> 1024', function (done) {
//     function category(desired){
//       if (desired >= 0 && desired <= 150){
//         return 100;
//       } else if (desired >= 151 && desired <= 250){
//         return 250;
//       } else if (desired >= 251 && desired <= 762){
//         return 500;
//       } else{
//         return 1024;
//       }
//     }
//     expect(category(300)).to.equal(500);
//     expect(category(800)).to.equal(1024);
//     done();
//   });
// });

// describe('func dimensioValid', function () {
//   it('200 -> true, -2 -> false, 12.. -> false ab1 -> false', function (done) {
//     function dimensionValid(dimension){
//       //there is a negative sign in the dimension
//       if (dimension.indexOf('-') !== -1){
//         return false;
//       } else if (isNaN(dimension)){
//         //not a number 
//         return false;
//       }
//       return true;
//     }
//     expect(dimensionValid('200')).to.equal(true);
//     expect(dimensionValid('-2')).to.equal(false);
//     expect(dimensionValid('12..')).to.equal(false);
//     expect(dimensionValid('ab1')).to.equal(false);
//     done();
//   });
// });

// describe('func getUrl', function () {
//   it('alc342.jpg -> true, 14567_1.jpg -> false', function (done) {
//     function getURL(destkey){
//       var params = {
//         Bucket: 'nux-test',
//         Key: destkey,
//       };  
//       var finalurl = ""
//       s3.getSignedUrl('getObject', params, function (err, url) {
//         if (err) {
//           throw new Error("cant't get url")  
//         } else {
//           finalurl = url;
//           return finalurl
//         }
//       });
//       return finalurl
//     }
    
//     expect(getURL("alc342.jpg")).to.not.equal(null);
//     expect(getURL("alc342.jpg")).to.be.a('string');
//     done();
//   });
// });


describe('func check if object is on s3', function () {
  it('alc342.jpg -> true, 14567_1.jpg -> false', function (done) {
    function confirmExistance() {
      var result = false;
      var params = {
         Bucket: 'nux-test',
         Key: "alc342.jpg",
      };
      s3.headObject(params).on('success', function(response) {
        console.log("Key was", response.request.params.Key);
      }).on('error',function(error){
           //error return a object with status code 404
      }).send();
    }
    confirmExistance()
    // expect(confirmExistance('alc342.jpg')).to.equal(true);
   // expect(getURL("alc342.jpg")).to.be.a('string');
    done();
  });
});














