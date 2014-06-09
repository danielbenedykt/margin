margin
======

margin creates PDF documents with cover sheets from Markdown, JSON & HTML templates you write.

Installation
------------

    npm install

Usage
-----

    node app
    
The created PDF will be stored as `pages.pdf`.
    
Files required
--------------

    data.json
    pages.md
    template/
        cover.html
        pdf.css

Conversion process:
* `data.json` is provided to `template/cover.html` using handlebars so any `{{handlebars}}` syntax is valid
* `pages.md` is converted into HTML, styled with `pdf.css`
* `cover.html` and the output from step2 are rendered into a single PDF called `pages.pdf`

Example template
----------------

`example-template` is a folder with an example in - rename it to `template` to use it.

