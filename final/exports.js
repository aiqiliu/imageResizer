// Sample image: https://s3-us-west-2.amazonaws.com/nux-test/Aiqi_netIDs/nux-logo.png
//TEST from: https://v58w4zas93.execute-api.us-west-2.amazonaws.com/dev/netid?netid=foo&width=150
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

var finalUrl = "";
var imageSource = 'http://s3-us-west-2.amazonaws.com/nux-test/Aiqi_netIDs/nux-logo.png';
exports.handler = function(event, context, callback){   
    // validate request
    //check for valid width (no negatives, no text, no null)
    var netid = event.netid;
    var desired_width = event.width;
	var desired_height = event.height;
	console.log(event.netid)

	console.log(desired_height == null)
    if (!desired_width && !desired_height) {
    	throw new Error("No dimension is specified");
    }
    else{ //one of or both dimension is given
    	//check if netid is valid
    	if (netid.length !== 6) {
    		throw new Error("netid is invalid");
    	} else {    	
    	//check if the image for that netid with the dimensions exists in AWS S3
    	var params = {
		    Bucket: 'nux-test',
		    Key: netid + '.jpg'
		};
		var originalImage = require('fs').createWriteStream('/tmp/' + netid + '.jpg');
        var originalPath = originalImage.path;

		s3.getObject(params, function(err, response){
		    if (err) {
		        console.log("Image not in S3");

		        async.waterfall([

		        	function downloadImage (next){
					  	download(imageSource, originalImage, function(err){
					  		if (err){
					  			console.log("can't download image", err)
					  		} else {
					  			console.log("downloaded")
					  			next();
					  		}
					  	});
					},

					function storeOnS3(next) {
						fs.readFile(originalPath, function(err, data) {
					    	if (err) {
					    		console.log("couldn't read file", err)
					    	} else {				    		
					    		console.log("able to read image")
					    		var putparams = {
						        	Bucket: 'nux-test', 
						        	Key: netid + '.jpg',
						        	Body: data
						        }
								s3.putObject(putparams, function(err, dataBucket) {
									if (err) {
										console.log("failed to put image in s3", err)
									} else {
										console.log("put image file in s3")
										next();
									}
								});
						    }
						});
					}, 

					function nextStep() {
						process(originalPath, desired_width, desired_height, event);

					}]);
			} else {
				console.log("object in s3");
				async.waterfall([
					function getObject(next){
						s3.getObject(params).createReadStream().pipe(originalImage);
						setTimeout(function(str1) {
							process(originalPath, desired_width, desired_height, event);
						  console.log(str1);
						}, 2000, "Making sure that the image is properly stored");
					},
				]);
			} 
		});	
	}
	}
};    

function process(originalPath, desired_width, desired_height, event){
	console.log("in the process func")
	console.log(originalPath)
	// var image_name = request.netID;
	var width = 0;
	var height = 0;
	var percent = 0;
	// var file = fname + '.jpg';

	//get original size and calculate new size
	//originalPath = '../input/light.jpg'
	gm(originalPath)
	.size(function (err, size) {
	  if (!err) {
	  	var width = size.width;
	  	var height = size.height;
	    console.log('width = ' + size.width);
	    console.log('height = ' + size.height);
	    newDimension(originalPath, width, height, desired_width, desired_height, event);
	  } else {
	  	console.log(err);
	  }
	});

}

function newDimension(originalImage, width, height, desired_width, desired_height, event){
	    //specified desired width
		if (desired_height == null){
			console.log("only width is specified");
			if (!dimensionValid(String(desired_width))) {
				throw new Error("dimension invalied")
			} else if (desired_width >= width){
				//return the url of the original file
				finalUrl = imageSource;
				console.log("final URL is: " + String(finalUrl))
				return 
			} else {
				//get dimension category and calculate new dimension
				desired_width = category(desired_width);
				console.log(desired_width)
				percent = desired_width/width;
				console.log(percent)
				desired_height = parseInt(height*percent);
				console.log("desired_height=" + String(desired_height))
				resize(originalImage, desired_width, desired_height, event);
			}		
		}
		//specified desired height 
		if (desired_width == null){
			//desired dimension > curr dimension
			if (!dimensionValid(String(desired_height))){
				throw new Error("dimension invalied")
			} else if (desired_height >= height){
				//return the url of the original file
				finalUrl = imageSource;
				console.log("final URL is: " + String(finalUrl))
				return 
			} else {
				desired_height = category(desired_height);
				percent = desired_height/height;
				console.log(percent)
				desired_width = parseInt(width*percent);
				resize(originalImage, desired_width, desired_height, event);
			}	
		}
}

var resize = function (originalImage, desired_width, desired_height, event){
//resize 
	//destkey = event.netid + "_" + String(desired_width) + "x" + String(desired_height) + ".jpg";
	var destkey = event.netid + "_" + String(desired_width) + "x" + String(desired_height) + ".jpg";
	var destbucket = 'nux-test';
	async.waterfall([
		function transform(next) {
			gm(originalImage).resize(desired_width, desired_height)
     			.toBuffer("jpg", function(err, buffer) {
                    if (err) {
                       throw new Error ("Cannot resize the image")
                    } else {
                    	console.log("transformed the pic")
                        next(null, buffer);
                    }
                });

        },
        function upload(data, next) {

            var params = {
            	Bucket: 'nux-test',
                Key: destkey,
                Body: data,
            }
            s3.putObject(params, function(err, response){
			    if(err) {
			        console.log("Image not uploaded", err);
		    	} else {
		    		console.log("image converted");
		    		next();
		    	}
		    });
		},
		function getURL(){

			var params = {
            	Bucket: 'nux-test',
                Key: destkey,
            }
		 	s3.getSignedUrl('getObject', params, function (err, url) {
			  console.log("The URL is", url);
			  finalUrl = url;
			});
		}
	]);
}


//caching. four categories of dimensions
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

function dimensionValid(dimension){
	//dimension is negative
	if (dimension.indexOf('-') !== -1){
		return false;
	}
	return true;
}

var download = function(imageSource, originalImage, callback){
  	request.head(imageSource, function(err, res, body){
  	if (err) {
  		console.log("can't download image", err)
  	} else {
  		console.log('content-type:', res.headers['content-type']);
    	console.log('content-length:', res.headers['content-length']);
    	request(imageSource).pipe(originalImage).on('close', callback);
  	}
  });
};



var event = {
	netid: "123456",
	width: 200

};
var context = {};
var callback = {};
exports.handler(event, context, callback)








