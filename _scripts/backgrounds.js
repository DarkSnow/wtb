#! /usr/bin/env node
/**
 * Generate all responsive backgrounds using image magic
 */

var settings = {
  src: '_backgrounds/',
  dst: 'img/bg/',
  sizes: [320, 480, 720, 1080, 1620]
}


var im = require('imagemagick');
var fs = require('fs');
var path = require('path');

function doResize(fileName, size) {

  var fileExt = path.extname(fileName);
  var fileTitle = path.basename(fileName, fileExt);

  var fileDest = fileTitle + '-' + size + fileExt;

  im.resize({
    srcPath: settings.src + fileName,
    dstPath: settings.dst + fileDest,
    width: size
  }, function(err, stdout, stderr){
    if (err) throw err;
    console.log('Generated ' + fileDest);
  });

}

fs.readdir(settings.src, function(err, list) {
  if (err) throw err;
  list.forEach(function(file) {
    settings.sizes.forEach(function(size) {
//      console.log('Calling for ' + file + ' @ ' + size);
      doResize(file, size);
    });  
  })
})

