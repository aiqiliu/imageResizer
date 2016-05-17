var expect = require("chai").expect;
// var app = require('../exports.js');
// var context = {};
// var callback = {};
// var event = {
//       netid: "123456",
//       width: 200
// };
// app.exports.handler(event, context, callback);

describe('func category', function () {
  it('300 -> 500, 800 -> 1024', function (done) {
    function category(desired){
      if (desired >= 0 && desired <= 150){
        return 100;
      } else if (desired >= 151 && desired <= 250){
        return 250;
      } else if (desired >= 251 && desired <= 762){
        return 500;
      } else{
        return 1024;
      }
    }
    expect(category(300)).to.equal(500);
    expect(category(800)).to.equal(1024);
    done();
  });
});

describe('func dimensioValid', function () {
  it('200 -> true, -2 -> false, 12.. -> false ab1 -> false', function (done) {
    function dimensionValid(dimension){
      //there is a negative sign in the dimension
      if (dimension.indexOf('-') !== -1){
        return false;
      } else if (isNaN(dimension)){
        //not a number 
        return false;
      }
      return true;
    }
    expect(dimensionValid('200')).to.equal(true);
    expect(dimensionValid('-2')).to.equal(false);
    expect(dimensionValid('12..')).to.equal(false);
    expect(dimensionValid('ab1')).to.equal(false);
    done();
  });
});

















