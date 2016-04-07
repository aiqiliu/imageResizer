var im = require("imagemagick");

function foo(callback){
  console.log("foo");
  setTimeout(function(){
    console.log("bar");
    callback();
  },2000);
}

console.log("hello");
foo(function(){
  console.log("outer");
});
console.log("World");
