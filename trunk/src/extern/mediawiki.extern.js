/**
 * If we give this JavaScript to Closure Compiler as an extern definition, Closure Compiler does not include it in the output JavaScript. The sole purpose of this JavaScript is to tell Closure Compiler, "Our code uses a function named textDiv() that's defined somewhere you don't know about, so don't rename any calls to textDiv()." 
 */

function importScript(text){};
function importScriptURI(uri){};

function importStylesheet(url){};
function appendCSS(css){};
 
var wgDBname,
	wgNamespaceIds,
	// article related
	wgArticleId,
	wgTitle,
	wgPageName,
	wgNamespaceNumber,
	wgCurRevisionId,
	wgCategories,
	wgIsArticle,
	wgAction,
	// user 
	wgUserName,
	debug,
	skin,
	status,
	wgUserLanguage,
	wgUserGroups,
	metaBase,
	// server
	wgServer,
	wgArticlePath,
	wgScript,
	wgScriptPath;
	
var mediaWiki;

var mw = function() {
	this.messages;
	this.usability = function () {
 		/**
 		 * getMsg
 		 * @param {string} msgid
 		 * @return {string} 
 		 */
 		 this.getMsg = function(msgid) {
 		 	
 		 }
 	};
}


var NavFrame;

/**
 * jQuery
 */
var $j;



/**
 * @constructor
 */
function wikiEditor() {}

/**
 * @constructor
 * @param {string} arg1
 * @param {*} arg2
 * @return {wikiEditor}
 */
wikiEditor.prototype.wikiEditor = function (arg1, arg2) {};


