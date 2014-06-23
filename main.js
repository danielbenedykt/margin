#!/usr/bin/env node

var userArguments = process.argv.slice(2); // Copies arguments list but removes first two options (script exec type & exec location)

if (userArguments.length > 1) {
    throw new Error('Only one argument may be specified (the URL for which you want to generate the AppCache.)');
}

var margin = require('./margin');

var folderPath = '.',
  pdfPath = null, // use the default
  callback = function(err, pdfPath) {
    if(err) {
      return error(err);
    }
    log('Document created successfully at '+pdfPath);
  };

margin.createPdfFromFolder(folderPath, pdfPath, callback);

function log(message) {
    process.stdout.write(message + '\n');
}

function error(err) {
    process.stderr.write(err);
}