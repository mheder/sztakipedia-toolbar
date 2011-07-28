// TODO from CiteTB
/* Sitewide options for the the Cite toolbar button:
* All options should be specified
*
* "date format" sets the date format used for the function to insert the current date
* Current available options:
* date - the daciy of the month
* zdate - day of the month, zero padded to 2 digits
* monthname - The month name
* month - The numberic month (1-12)
* zmonth - numeric month, zero padded to 2 digits
* year - The full year (4 digits)
*
* "autodate fields" is a list of template fields that should have a button to insert the current date
* 
* "months" is a list of localized month names
*
* "modal" - if true, the dialogs will be modal windows, blocking access to the rest of the window.
* See http://en.wikipedia.org/wiki/Modal_window
* All dialogs in the toolbar are modal by default
*
* "autoparse" - if true, previewing a ref will automatically trigger a preview of the parsed wikitext.
* Its not recommended to set this to true as a global setting as it may slow the script down for people
* with slow connections
*
* "expandtemplates" - if true, templates and parser functions will be expanded when getting page text
* (templates inside of ref tags will not be expanded). This will allow references inside of templates or
* references using {{#tag:ref}} to be listed in the named refs dialog and searched by error checks.
* This may slow loading the named refs and error check dialogs.
*/

SztakipediaTB.Options = {
"date format" : "<date> <monthname> <year>",
"autodate fields" : ['accessdate'],
"months" : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
"modal" : true,
"autoparse" : false,
"expandtemplates" : false,
"basedir" : "http://pediadev.sztaki.hu/~illes/SztakipediaToolbar/"
};
/*
// Cite template definitions
new sztakipediaTemplate('cite web', 'web',
[ // Basic fields
{"field": "last", "autofillprop":"last1"},
{"field": "first", "autofillprop":"first1"}, 
{"field": "title", "autofillprop":"title"},
{"field": "url"},
{"field": "work", "tooltip": "sztakipedia-work-tooltip", "autofillprop":"journal"},
{"field": "publisher"},
{"field": "accessdate"}
],
[ // Expanded fields
{"field": "author"},
{"field": "authorlink", "tooltip":"sztakipedia-authorlink-tooltip"},
{"field": "coauthors", "autofillprop":"coauthors"},
{"field": "archiveurl"},
{"field": "archivedate"},
{"field": "location"},
{"field": "page"},
{"field": "pages", "autofillprop":"pages"},
{"field": "language"},
{"field": "format"},
{"field": "doi", "autofillid":"doi"},
{"field": "date", "autofillprop":"date"},
{"field": "month"},
{"field": "year"},
{"field": "quote"}
]);

new sztakipediaTemplate('cite news', 'news',
[ // Basic fields
{"field": "last"},
{"field": "first"}, 
{"field": "title"},
{"field": "url"},
{"field": "accessdate"},
{"field": "newspaper"},
{"field": "date"}
],
[ // Expanded fields
{"field": "author"},
{"field": "author2"},
{"field": "author3"},
{"field": "author4"},
{"field": "author5"},
{"field": "authorlink", "tooltip":"sztakipedia-authorlink-tooltip"},
{"field": "agency"},
{"field": "archiveurl"},
{"field": "archivedate"},
{"field": "location"},
{"field": "page"},
{"field": "pages"},
{"field": "language"},
{"field": "format"},
{"field": "doi"},
{"field": "month"},
{"field": "year"},
{"field": "quote"}
]);

new sztakipediaTemplate('cite book', 'book',
[ // Basic fields
{"field": "last", "autofillprop":"last1"},
{"field": "first", "autofillprop":"first1"}, 
{"field": "title", "autofillprop":"title"},
{"field": "year", "autofillprop":"year"},
{"field": "publisher", "autofillprop":"publisher"},
{"field": "location", "autofillprop":"location"},
{"field": "isbn", "autofillid":"isbn"},
{"field": "pages"},
{"field": "url"}
],
[ // Expanded fields
{"field": "author"},
{"field": "edition", "autofillprop":"edition"},
{"field": "authorlink", "tooltip":"sztakipedia-authorlink-tooltip"},
{"field": "coauthors", "autofillprop":"coauthors"},
{"field": "editor"},
{"field": "accessdate"},
{"field": "archiveurl"},
{"field": "archivedate"},
{"field": "page"},
{"field": "language"},
{"field": "format"},
{"field": "chapter"},
{"field": "date"},
{"field": "month"},
{"field": "quote"}
]);

new sztakipediaTemplate('cite url', 'url',
[ // Basic fields
{"field": "url"},
{"field": "accessdate"}
],
[ // Expanded fields
{"field": "author"},
{"field": "edition", "autofillprop":"edition"},
{"field": "authorlink", "tooltip":"sztakipedia-authorlink-tooltip"},
{"field": "coauthors", "autofillprop":"coauthors"},
{"field": "editor"},
{"field": "archiveurl"},
{"field": "archivedate"},
{"field": "language"},
{"field": "format"},
{"field": "date"},
{"field": "month"},
{"field": "quote"}
]);

new sztakipediaTemplate('cite journal', 'journal',
[ // Basic fields
{"field": "last", "autofillprop":"last1"},
{"field": "first", "autofillprop":"first1"},
{"field": "coauthors", "autofillprop":"coauthors"},
{"field": "title", "autofillprop":"title"},
{"field": "journal", "autofillprop":"journal"},
{"field": "date", "autofillprop":"date"},
{"field": "year"},
{"field": "month"},
{"field": "volume", "autofillprop":"volume"},
{"field": "series"},
{"field": "issue", "autofillprop":"issue"},
{"field": "pages", "autofillprop":"pages"},
{"field": "doi", "autofillid":"doi"},
{"field": "pmid", "autofillid":"pmid"},
{"field": "url"},
{"field": "accessdate"}
],
[ // Expanded fields
{"field": "author"},
{"field": "authorlink"},
{"field": "editor1-first"},
{"field": "editor1-last"},
{"field": "editor1-link"},
{"field": "page"},
{"field": "at", "tooltip":"sztakipedia-at-tooltip"},
{"field": "trans_title"},
{"field": "publisher"},
{"field": "location"},
{"field": "language"},
{"field": "format"},
{"field": "issn"},
{"field": "pmc"},
{"field": "oclc"},
{"field": "bibcode"},
{"field": "id"},
{"field": "quote"},
{"field": "ref", "tooltip":"sztakipedia-ref-tooltip"},
{"field": "postscript", "tooltip":"sztakipedia-postscript-tooltip"}
]);
*/

// TODO from CiteTB
//new sztakipediaErrorCheck({'type':'reflist', 'testname':'samecontent', 'desc': 'sztakipedia-samecontent-desc',
//'func': function(reflist) {
//  var errors = [];
//  var refs2 = [];
//  for(var i=0; i<reflist.length; i++) {
//    if (!reflist[i].shorttag) {
//      if ($j.inArray(reflist[i].content, refs2) != -1) {
//        if ($j.inArray(reflist[i].content, errors) == -1) {
//          errors.push(reflist[i].content);
//        }
//      } else {
//        refs2.push(reflist[i].content);
//      }
//    }
//  }
//  ret = [];
//  for(var j=0; j<errors.length; j++) {
//    ret.push({'msg':'sztakipedia-samecontent-error', 'err':errors[j]});
//  }
//  return ret;
//}}
//);
//
//// TODO from CiteTB
//new sztakipediaErrorCheck({'type':'reflist', 'testname':'repeated', 'desc':'sztakipedia-repeated-desc',
//'func': function(reflist) {
//  var errors = [];
//  var refs2 = [];
//  for(var i=0; i<reflist.length; i++) {
//    if (!reflist[i].shorttag && reflist[i].refname) {
//      if ($j.inArray(reflist[i].refname, refs2) != -1) {
//        if ($j.inArray(reflist[i].refname, errors) == -1) {
//          errors.push(reflist[i].refname);
//        }
//      } else {
//        refs2.push(reflist[i].refname);
//      }
//    }
//  }
//  ret = [];
//  for(var j=0; j<errors.length; j++) {
//    ret.push({'msg':'sztakipedia-repeated-error', 'err':errors[j]});
//  }
//  return ret;
//}}
//);
//
//
//new sztakipediaErrorCheck({'type':'reflist', 'testname':'undefined', 'desc':'sztakipedia-undefined-desc',
//'func': function(reflist) {
//  var errors = [];
//  var longrefs = [];
//  for(var i=0; i<reflist.length; i++) {
//    if (!reflist[i].shorttag && reflist[i].refname) {
//      longrefs.push(reflist[i].refname);
//    }
//  }
//  for(var j=0; i<reflist.length; j++) {
//    if (reflist[i].shorttag && $j.inArray(reflist[i].refname, errors) == -1 && $j.inArray(reflist[i].refname, longrefs) == -1) {
//      errors.push(reflist[i].refname);
//    }
//  }
//  ret = [];
//  for(var j=0; j<errors.length; j++) {
//    ret.push({'msg':'sztakipedia-undefined-error', 'err':errors[j]});
//  }
//  return ret;
//}}
//);

SztakipediaTB.init();