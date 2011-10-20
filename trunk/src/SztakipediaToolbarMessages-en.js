/* Copyright 2011 MTA SZTAKI - Licensed under: GNU General Public License v2.0 or later */

// All user-facing messages
// TODO: Document usage
mw.usability.addMessages( { 
'sztakipedia-section-label' : 'Sztakipedia',

// TODO from CiteTB                          
'sztakipedia-template-list' : 'Templates',
'sztakipedia-named-refs-label' : 'Named references',
'sztakipedia-named-refs-title' : 'Insert a named reference',
'sztakipedia-named-refs-button' : 'Named references',
'sztakipedia-named-refs-dropdown' : 'Named references', // Used on the top of the named refs list dropdown
'sztakipedia-errorcheck-label' : 'Error check',
'sztakipedia-errorcheck-button' : 'Check for errors',
'sztakipedia-dialog-web' : 'Web citation',
'sztakipedia-dialog-news' : 'News citation',
'sztakipedia-dialog-book' : 'Book citation',
'sztakipedia-dialog-journal' : 'Journal citation',
'sztakipedia-form-submit' : 'Insert',
'sztakipedia-form-showhide' : 'Show/hide extra fields',
'sztakipedia-no-namedrefs' : 'Cannot find any named references on the page',
'sztakipedia-namedrefs-intro' : "Select a name from the list to see the ref content. Click 'Insert' to insert a reference to it in the text.",
'sztakipedia-raw-preview' : 'Wikitext:',
'sztakipedia-parsed-label' : 'Parsed wikitext:',
'sztakipedia-form-parse' : 'Show parsed preview',
'sztakipedia-refpreview' : 'Preview',
'sztakipedia-name-label' : 'Ref name',
'sztakipedia-group-label' : 'Ref group',
'sztakipedia-errorcheck-submit' : 'Check',
'sztakipedia-errorcheck-heading' : 'Check for the following errors:',
'sztakipedia-error-unclosed' : 'Unclosed <span style="font-family:monospace">&lt;ref&gt;</span> tags',
'sztakipedia-error-samecontent' : 'References with the same content',
'sztakipedia-error-templates' : 'References not using a <a href="http://en.wikipedia.org/wiki/Wikipedia:Citation_templates">citation template</a>',
'sztakipedia-error-repeated' : 'Multiple references with the same name',
'sztakipedia-error-undef' : 'Usage of undefined named references',
'sztakipedia-error-samecontent-msg' : 'Multiple refs contain the same content: $1',
'sztakipedia-error-repeated-msg' : 'Mutiple refs are given the name: \'$1\'',
'sztakipedia-error-templates-msg' : 'Does not use a template: $1',
'sztakipedia-form-reset' : 'Reset form',
'sztakipedia-loading' : 'Loading data', // Shown while pagetext is being downloaded from the API
'sztakipedia-insert-date' : 'Insert current date', // Alt/title text for 'insert date' icon
'sztakipedia-err-report-heading' : 'Citation error report', // Heading for error report table
'sztakipedia-err-report-close' : 'Close', // Alt/title text for 'close' icon on error report
'sztakipedia-err-report-empty' : 'No errors found', // Message displayed in the error report list if there are no errors
'sztakipedia-autofill-alt' : 'Autofill', // Alt text for autofill button image
'sztakipedia-work-tooltip' : 'What larger work this is part of',
'sztakipedia-authorlink-tooltip' : 'If the author has an article, the name of the article',
'sztakipedia-at-tooltip' : 'Position within the resource (when page is inappropriate)',
'sztakipedia-ref-tooltip' : 'ID for anchor (for creating a linkable reference)',
'sztakipedia-postscript-tooltip' : 'If specified, overrides the default behavior of terminating the citation with a period',
'sztakipedia-samecontent-desc' : 'Check for references with the same content',
'sztakipedia-samecontent-error' : 'Multiple references contain the same content',
'sztakipedia-repeated-desc' : 'Multiple references with the same name',
'sztakipedia-repeated-error' : 'Multiple references are using the same name',
'sztakipedia-undefined-desc' : 'Usage of undefined named references',
'sztakipedia-undefined-error' : 'A named reference is used but not defined',
'sztakipedia-first-label' : 'First name',
'sztakipedia-last-label' : 'Last name',
'sztakipedia-title-label' : 'Title',
'sztakipedia-work-label' : 'Work',
'sztakipedia-newspaper-label' : 'Newspaper',
'sztakipedia-journal-label' : 'Journal',
'sztakipedia-publisher-label' : 'Publisher',
'sztakipedia-accessdate-label' : 'Access date',
'sztakipedia-author-label' : 'Author',
'sztakipedia-authorlink-label' : "Author's article",
'sztakipedia-coauthors-label' : 'Coauthors',
'sztakipedia-archiveurl-label' : 'Archive URL',
'sztakipedia-archivedate-label' : 'Archive date',
'sztakipedia-location-label' : 'Location',
'sztakipedia-page-label' : 'Page',
'sztakipedia-pages-label' : 'Pages',
'sztakipedia-at-label' : 'At',
'sztakipedia-chapter-label' : 'Chapter',
'sztakipedia-volume-label' : 'Volume',
'sztakipedia-series-label' : 'Series',
'sztakipedia-issue-label' : 'Issue',
'sztakipedia-language-label' : 'Language',
'sztakipedia-format-label' : 'Format',
'sztakipedia-date-label' : 'Date',
'sztakipedia-month-label' : 'Month',
'sztakipedia-year-label' : 'Year',
'sztakipedia-quote-label' : 'Quote',
'sztakipedia-author2-label' : '2nd author',
'sztakipedia-author3-label' : '3rd author',
'sztakipedia-author4-label' : '4th author',
'sztakipedia-author5-label' : '5th author',
'sztakipedia-agency-label' : 'Agency',
'sztakipedia-editor-label' : 'Editor',
'sztakipedia-editor1-first-label' : "Editor's first",
'sztakipedia-editor1-last-label' : "Editor's last",
'sztakipedia-editor1-link-label' : "Editor's article",
'sztakipedia-edition-label' : 'Edition',
'sztakipedia-trans_title-label' : 'Translated title',
'sztakipedia-ref-label' : 'Ref',
'sztakipedia-postscript-label' : 'Postscript',
'sztakipedia-url-label' : 'URL',
'sztakipedia-doi-label' : 'DOI',
'sztakipedia-isbn-label' : 'ISBN',
'sztakipedia-pmid-label' : 'PMID',
'sztakipedia-issn-label' : 'ISSN',
'sztakipedia-pmc-label' : 'PMC',
'sztakipedia-oclc-label' : 'OCLC',
'sztakipedia-bibcode-label' : 'Bibcode',
'sztakipedia-id-label' : 'ID',

// NEW
'sztakipedia-dialog-bookprediction-title' : 'Book suggestions and search',
//'sztakipedia-bookprediction-suggestions-intro' : 'Books possibly',
'sztakipedia-bookprediction-form-title' : 'Search books',
'sztakipedia-bookprediction-form-token-label' : 'Include article text in search',
'sztakipedia-bookprediction-suggestions-title' : 'Results',

'sztakipedia-dialog-info-title' : 'Debug information',
'sztakipedia-dialog-info-dialogbuilders-title' : 'Dialog builders',
'sztakipedia-dialog-info-processors-title' : 'List extractors',
'sztakipedia-dialog-info-session-title' : 'Session',
'sztakipedia-info-processors-intro' : 'Available extractors:',
'sztakipedia-info-dialogbuilders-intro' : 'Available dialogs:',

'sztakipedia-link-suggestions-intro' : 'The following terms may be linked:',

'sztakipedia-dialog-link-title' : 'Internal link suggestions',
'sztakipedia-dialog-logo-title' : 'About Sztakipedia',
'sztakipedia-dialog-spotlight-title' : 'Spotlight Suggestions',
'wikieditor-toolbar-tool-spotlight-cancel' : 'Cancel',
'sztakipedia-search-form-submit' : 'Search',


//'sztakipedia-category-suggestions-intro' : 'The following categories could be relevant:',
'sztakipedia-dialog-category-title' : 'Category suggestions',
'sztakipedia-no-category-suggestions' : 'No suggestions.',

//'sztakipedia-infobox-suggestions-intro' : 'The following categories could be relevant:',
'sztakipedia-dialog-infobox-title' : 'Infobox suggestions',
'sztakipedia-no-infobox-suggestions' : 'No suggestions.',

// actions
'sztakipedia-reject' : 'Dismiss',
'sztakipedia-accept' : 'Insert',
'sztakipedia-preview' : 'Preview',
'dummy' : 'dummy'
});

// Load configuration for site
//var SztakipediaToolbarLocal = importScript('MediaWiki:SztakipediaToolbarConfig.js'); TODO
var SztakipediaToolbarLocal = importScriptURI(SztakipediaTB.getOption('basedir') + 'SztakipediaToolbarConfig.js');
