var im = require("imagemagick")
var data = "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";

require("fs").writeFile("out.jpg", data, 'base64', function(err) {
  console.log(err);
});

im.readMetadata('1.jpg', function(err, metadata){
  if (err) throw err;
  console.log('Shot at '+metadata.exif.dateTimeOriginal);
})
width = 100;

