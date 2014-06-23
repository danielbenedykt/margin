TO-DO:
- make template work as a single template with {{handlebars-type syntax}} to be read from cover/data.json and <!-- pages.md --> placeholders
- add samples directory with invoice and multi-page document
- update README to explain use as command-line tool and node module
- make into a command-line tool
- change output to document.pdf - DONE


margin
======

margin creates PDF documents with cover sheets from Markdown, JSON & HTML templates you write.

Installation
------------

To install as a node module:

    npm install penrosestudio/margin

To install as a command-line tool:

    npm install -g margin
    sudo npm install -g margin (if you need admin privileges)


Usage as a command-line tool
----------------------------

    margin <path>
    
margin will inspect the directory `path` (which can be `.`) for the following files:

    data.json
    pages.md
    template/
        index.html
        style.css
        <other HTML file assets e.g. JavaScript, fonts>

* `data.json` is provided to `template/index.html` using the handlebars templating engine, so any `{{handlebars}}` syntax is replaced with the corresponding properties from `data.json`
* `pages.md` is converted from markdown into HTML, and placed into `template/index.html` replacing the HTML comment `<!-- pages.md -->`
* `template/index.html` is rendered into a PDF called `index.pdf`

The HTML template, styling & multi-page documents
-------------------------------------------------

Because the `index.html` template file is rendered using Phantom, any valid CSS, JavaScript or fonts are respected during the conversion to PDF.

For example, a technique for creating multi-page documents, where the cover and any `<h1>` starts its own page is the following:

In the stylesheet:

    div.section {
      page-break-after:always;
    }
    div.main h1 {
      page-break-before:always;
    }

In the HTML template:

    <div class="section">
      <h1>This is the cover page</h1>
      <h2>{{author}}</h2>
      <p>{{coverContent}}</p>
    </div>
    <div class="main section">
      <!-- pages.md -->
    </div>

In `pages.md`:

    This is a top-level heading - it will start a new page
    ------------------------------------------------------
    
    This paragraph will be on the same page as the header above.
    
    etc.
    
    This is another top-level heading - it will start a new page
    ------------------------------------------------------------
    
    This paragraph will be on the same page as the header above.
    
    etc.

Example template
----------------

`example-template` is a folder with an example in - rename it to `template` to use it.

Usage as a node module
----------------------

margin makes converting HTML into PDF documents easy:

`createPdfFromHTML(pdfPath, html, callback)`:

    var margin = require('margin'),
      pdfPath = './output.pdf',
      html = '<p>some sample HTML, perhaps loaded from a file</p>';
    
    margin.createPdfFromHTML(pdfPath, html, function(err, pdfPath) {
      if(err) {
        return console.error('there was a problem creating the PDF', err);
      }
      console.log('PDF successfully created!');
    });

`createPdfFromFolder(folderPath, pdfPath, callback)`:

    TO-DO: example or docs here