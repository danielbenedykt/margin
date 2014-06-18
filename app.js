/* 
  margin
*/
var phantom = require('phantom'),
  fs = require('fs'),
  path = require('path'),
  handlebars = require('handlebars'),
  marked = require('marked'),
  readOptions = { "encoding": "utf-8" };


var createPdfFromHTML = function(pdfPath, html, callback) {
  var tempFilename = path.join(__dirname,"marginTemporaryHTMLFile.html");
  if(!pdfPath) {
    pdfPath = path.join(folderPath,"pages.pdf");
  }
  if(!html) {
    html = '';
  }
  // write the HTML to a temporary file
  fs.writeFile(tempFilename, html, function() {
    phantom.create(function(ph){
      ph.createPage(function(page) {
        // open the temp file in phantom
        page.open(tempFilename, function(status) {
          page.set('viewportSize', {width:1280,height:1800}, function(result) {
            // create the PDF
            page.render(pdfPath, function(){
              console.log('Page Rendered');
              ph.exit();
              fs.unlink(tempFilename, function(err) {
                console.log('Finished');
                if(callback) {
                  callback(err);
                }
              });
            });
          });
        });
      });
    });
  });
};

/*
 * Create a multi-page PDF with a cover template
 *
 * Read in cover template
 * Render cover + data JSON through handlebars
 * Turn pages.md into HTML
 * Add pages.md to end of cover.html
 * Convert HTML into PDF
 */
var createPdfFromFolder = function(folderPath, pdfPath, callback) {
  if(!folderPath) {
    folderPath = __dirname;
  }
  var coverTemplateFilename = path.join(folderPath,"template/cover.html"),
    dataJSONFileName = path.join(folderPath,"data.json"),
    pagesFileName = path.join(folderPath,"pages.md");

    // read in the cover template
    fs.readFile(coverTemplateFilename, readOptions, function(err, source) {
      var template = handlebars.compile(source);
      // read in the JSON data for the cover
      fs.readFile(dataJSONFileName, readOptions, function(err, data) {
        var jsonData = JSON.parse(data),
          result = template(jsonData);
        // read in the markdown document
        fs.readFile(pagesFileName, readOptions, function(err, data) {
          // convert markdown to HTML
          var pagesHTML = marked(data),
            bits = result.split('</body>'),
            htmlForRenderingToPDF;
          // wrap pages HTML in a wrapper and insert before the end of the body
          bits.splice(1,0,'<div class="wrapper">',pagesHTML,'</div></body>');
          htmlForRenderingToPDF = bits.join("");
          // create the PDF
          createPdfFromHTML(pdfPath, htmlForRenderingToPDF, callback);
        });
      });
    });  
};

module.exports = {
  createPdfFromHTML: createPdfFromHTML,
  createPdfFromFolder: createPdfFromFolder
};