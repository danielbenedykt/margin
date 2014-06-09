/* 
  margin
*/
var phantom = require('phantom'),
  fs = require('fs'),
  handlebars = require('handlebars'),
  marked = require('marked'),
  readOptions = { "encoding": "utf-8" },
  templateFolder = "template";

/*
 * Read in cover template
 * Render cover + data JSON through handlebars
 * Turn pages.md into HTML
 * Add pages.md to end of cover.html
 * Convert HTML into PDF
 */

phantom.create(function(ph){
  ph.createPage(function(page) {
    var templateFilename = __dirname+"/"+templateFolder+"/cover.html";
    fs.readFile(templateFilename, readOptions, function(err, source) {
      var template = handlebars.compile(source);
      
      var dataJSONFileName = __dirname+"/data.json";
      fs.readFile(dataJSONFileName, readOptions, function(err, data) {
    
        var jsonData = JSON.parse(data);
        var result = template(jsonData);
        var filename = __dirname+"/"+templateFolder+"/temp.html";
        
        var pagesFileName = __dirname+"/pages.md";
        
        fs.readFile(pagesFileName, readOptions, function(err, data) {
          var pagesHTML = marked(data);
          var bits = result.split('</body>');
          // wrap pages HTML in a wrapper and insert before the end of the body
          bits.splice(1,0,'<div class="wrapper">',pagesHTML,'</div></body>');
          var htmlForRenderingToPDF = bits.join("");

          fs.writeFile(filename, htmlForRenderingToPDF, function() {
            page.open(filename, function(status) {
              page.set('viewportSize', {width:1280,height:1800}, function(result) {
                page.render('pages.pdf', function(){
                  console.log('Page Rendered');
                  ph.exit();
                  /*
fs.unlink(__dirname+"/"+templateFolder+"/temp.html", function(err) {
                    console.log('Finished');
                  });
*/
                });        
              });
            });
          });
        });
      });
    });
  });
});