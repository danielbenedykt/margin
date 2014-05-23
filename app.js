/* 
  margin
*/
var phantom = require('phantom'),
  fs = require('fs'),
  handlebars = require('handlebars'),
  readOptions = { "encoding": "utf-8" },
  templateFolder = "template";

phantom.create(function(ph){
  ph.createPage(function(page) {
    var invoiceTemplateFilename = __dirname+"/"+templateFolder+"/index.html";
    
    fs.readFile(invoiceTemplateFilename, readOptions, function(err, source) {
    
      var template = handlebars.compile(source);
      var dataJSONFileName = __dirname+"/"+templateFolder+"/data.json";
    
      fs.readFile(dataJSONFileName, readOptions, function(err, data) {
    
        var jsonData = JSON.parse(data);
        var result = template(jsonData);
        var filename = __dirname+"/"+templateFolder+"/temp.html";
    
        fs.writeFile(filename, result, function() {
          page.open(filename, function(status) {
            page.set('viewportSize', {width:1280,height:1800}, function(result) {
              page.render('invoice.pdf', function(){
                console.log('Page Rendered');
                ph.exit();
                fs.unlink(__dirname+"/"+templateFolder+"/temp.html", function(err) {
                  console.log('Finished');
                });
              });        
            });
          });
        });
      });
    });
  });
});