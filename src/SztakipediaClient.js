// Global object
if (typeof SztakipediaClient == 'undefined') {
	/**
	 * @class Offers convenient interface to the Sztakipedia REST API services.
	 * @constructor
	 * @namespace
	 */	
	var SztakipediaClient = {

		// Global options			
		"Options" : {},

		// User options
		"UserOptions" : {},

		// Script defaults
		"DefaultOptions" : {}
	};
	window['SztakipediaClient'] = SztakipediaClient; // for Closure		
}

/**
 * Default options - these mainly exist so the script won't break when a new option is added.
 */
SztakipediaClient.DefaultOptions = {
	'api url' : "http://diadev.sztaki.hu/SWEA-Server/REST/sztakipedia", // The RESTful API endpoint
	//	'json proxy url' : "http://localhost:8080/json-proxy/", // JSONP proxy for cross-site requests
	'debug' : true
// whether to produce debugging output
};

/**
 * Get an option - user settings override global which override defaults
 */
SztakipediaClient.getOption = function(opt) {
	if (SztakipediaClient.UserOptions[opt] != undefined) {
		return SztakipediaClient.UserOptions[opt];
	}
	else if (SztakipediaClient.Options[opt] != undefined) {
		return SztakipediaClient.Options[opt];
	}
	return SztakipediaClient.DefaultOptions[opt];
};

// XML HELPER FUNCTIONS

/**
 * Uses the native parsing function of the browser to create a valid XML Document.
 * 
 * @note Taken from jQuery.parseXML() (see http://api.jquery.com/jQuery.parseXML/) We need this because the jQuery
 *       version used in MediaWiki/WikiEditor does not provide it (probably <1.5).
 * 
 * @param data -
 *            the XML as a string
 * @return the XML DOM, or <code>undefined</code> if <code>data</code> is <code>undefined</code>
 */
SztakipediaClient.parseXML = function(data, xml, tmp) {
	if (typeof data == 'undefined')
		return undefined;

	//alert('Raw: ' + data);

	// FIXME hack to remove <!DOCTYPE ...> header
	data = data.replace(/^<!DOCTYPE[^>]+>/, '');
	// FIXME hack to close HTML-style elements in XHTML
	data = data.replace(/(<(meta|link|img) [^>]+)>/i, '$1/>');

	if (window.DOMParser) { // Standard
		tmp = new DOMParser();
		xml = tmp.parseFromString(data, "text/xml");
	}
	else { // IE
		xml = new ActiveXObject("Microsoft.XMLDOM");
		xml.async = "false";
		xml.loadXML(data);
	}

	tmp = xml.documentElement;

	if (!tmp || !tmp.nodeName || tmp.nodeName === "parsererror") {
		//		alert("Invalid XML string: " + JSON.stringify(data, null, 2));
		if (SztakipediaClient.getOption('debug'))
			alert("Invalid XML string: '" + data + "'");
		throw "XML not well-formed.";
	}
	//alert('XML: ' + JSON.stringify(xml, null, 2));
	return xml;
};

/**
 * Read an XML elements attribute list into a hash.
 */
SztakipediaClient.xmlAttributesAsHash = function(elem) {
	if (typeof elem === 'undefined')
		return undefined;
	var item = {};
	for ( var i = 0; i < elem.attributes.length; i++) {
		var attrib = elem.attributes[i];
		item[attrib.name] = attrib.value;
	}
	return item;
};

/**
 * Read an HTML elements attribute list into a hash.
 */
SztakipediaClient.htmlAttributesAsHash = function(elem) {
	if (typeof elem === 'undefined')
		return undefined;
	var item = {};
	for ( var i = 0; i < elem.attributes.length; i++) {
		var attrib = elem.attributes[i];
		if (attrib.specified == true) { // Works in most browsers
			item[attrib.name] = attrib.value;
		}
	}
	return item;
};

/**
 * Concatenate text nodes inside the element.
 */
SztakipediaClient.extractTextRecursive = function(elem) {
	if (elem == null)
		return "";

	var acc = "";
	if (elem.nodeType == Node.TEXT_NODE) {
		acc += elem.nodeValue;
	}
	if (elem.hasChildNodes()) {
		var children = elem.childNodes;
		for ( var i = 0; i < children.length; i++) {
			acc += SztakipediaClient.extractTextRecursive(children[i]);
		}
	}
	return acc;
};

/**
 * Concatenate text nodes inside the element, up to immediate child elements.
 */
SztakipediaClient.extractTextNonRecursive = function(elem) {
	if (elem == null) {
		return "";
	}
	else {
		var acc = "";
		if (elem.nodeType == Node.TEXT_NODE) {
			acc += elem.nodeValue;
		}
		if (elem.hasChildNodes()) {
			var children = elem.childNodes;
			for ( var i = 0; i < children.length; i++) {
				if (children[i].nodeType == Node.TEXT_NODE) {
					acc += children[i].nodeValue;
				}
			}
		}
		return acc;
	}
};

// AJAX FUNCTIONS
///**
// * Assemble a query string (the fragment after '?') from a hash object.
// */
//var toQueryString = function(params) {
//	var kvp = [];
//	for (var key in params) {
//		kvp.append(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
//	}
//	return kvp.join('&');
//};

/**
 * Assemble a query URL from a set of parameters.
 */
SztakipediaClient.queryUrl = function(params) {
	if (typeof SztakipediaClient.getOption('json proxy url') === 'undefined')
		params['format'] = 'json';
	var url = SztakipediaClient.getOption('api url') + '?' + $j.param(params);
	if (typeof SztakipediaClient.getOption('json proxy url') !== 'undefined') {
		url = SztakipediaClient.getOption('json proxy url') + '?' + $j.param( {
			'url' : url
		});
	}
	//alert('URL: ' + url);
	return url;
};

/**
 * Perform a GET request to the API endpoint (possibly via a JSONP proxy).
 */
SztakipediaClient.doGet = function(params, callback) {
	var url = SztakipediaClient.queryUrl(params);
	$j.ajax( {
		'url' : url,
		'dataType' : 'jsonp',
		'jsonp' : 'callback',
		'success' : function(data) {
			//alert("RAW: " + data);
		callback(data);
	},
	'error' : function(xhr, textStatus, httpErrorThrown) {
		alert('ERROR: while performing AJAX call. (status: ' + textStatus + ', HTTP error: ' + httpErrorThrown + ', URL: ' + url + ")"); // TODO remove in production version?
		callback(undefined);
	}
	});
};

// PARSER FUNCTIONS (XML -> Javascript)
SztakipediaClient.parseProcessors = function(xml) {
	if (typeof xml == 'undefined')
		return undefined;
	var list = {};
	var elems = xml.getElementsByTagName('Processor');
	for ( var j = 0; j < elems.length; j++) {
		var processor = SztakipediaClient.xmlAttributesAsHash(elems[j]);
		list[processor['name']] = processor;
	}
	//alert('parseProcessors: ' + JSON.stringify(list, null, 2));
	return list;
};

SztakipediaClient.parseDialogBuilders = function(xml) {
	if (typeof xml === 'undefined')
		return undefined;
	var list = {};
	var elems = xml.getElementsByTagName('DialogBuilder');
	for ( var j = 0; j < elems.length; j++) {
		var dialogBuilder = SztakipediaClient.xmlAttributesAsHash(elems[j]);
		list[dialogBuilder['name']] = dialogBuilder;
	}
	//alert('parseDialogBuilders: ' + JSON.stringify(list, null, 2));
	return list;
};

SztakipediaClient.parseDialog = function(xml) {
	if (typeof xml === 'undefined')
		return undefined;
	var list = {};
	var builder = xml.documentElement.getAttribute('builder');
	var elems = xml.getElementsByTagName('Dialog');
	for ( var j = 0; j < elems.length; j++) {
		var elem = elems[j];
		var dialog = SztakipediaClient.xmlAttributesAsHash(elem);
		dialog['builder'] = builder;
		dialog['text'] = SztakipediaClient.extractTextNonRecursive(elem.getElementsByTagName('Text')[0]);
		dialog['suggestions'] = [];

		var suggestionelems = elem.getElementsByTagName('Suggestion');
		for ( var k = 0; k < suggestionelems.length; k++) {
			var suggestionelem = suggestionelems[k];

			var suggestion = SztakipediaClient.xmlAttributesAsHash(suggestionelem);
			suggestion['text'] = SztakipediaClient.extractTextNonRecursive(suggestionelem.getElementsByTagName('Text')[0]);
			if (suggestionelem.getElementsByTagName('SuggestionURL').length) {
				var url = SztakipediaClient.extractTextNonRecursive(suggestionelem.getElementsByTagName('SuggestionURL')[0]);
				if (url)
					suggestion['url'] = url;
			}
			if (suggestionelem.getElementsByTagName('Image').length) {
				suggestion['image'] = SztakipediaClient.xmlAttributesAsHash(suggestionelem.getElementsByTagName('FullResolution')[0]);
				suggestion['thumbnail'] = SztakipediaClient.xmlAttributesAsHash(suggestionelem.getElementsByTagName('Thumbnail')[0]);
			}

			// extract content in different formats
			var wikitext = SztakipediaClient.extractTextNonRecursive(suggestionelem.getElementsByTagName('SuggestionContents')[0]
					.getElementsByTagName('WikitextFormat')[0]);
			if (wikitext)
				suggestion['content'] = wikitext;

			var xhtml = SztakipediaClient.extractTextNonRecursive(suggestionelem.getElementsByTagName('SuggestionContents')[0]
					.getElementsByTagName('XhtmlFormat')[0]);
			if (xhtml)
				suggestion['html'] = xhtml;

			// parse insertion strategies
			suggestion['insertionstrategies'] = {};
			var iselems = suggestionelem.getElementsByTagName('InsertionStrategies')[0].childNodes;
			for ( var l = 0; l < iselems.length; l++) {
				var iselem = iselems[l];
				switch (iselem.tagName) {
					case 'ContextSensitive':
						suggestion['insertionstrategies']['contextsensitive'] = {
							'replace' : SztakipediaClient.extractTextNonRecursive(iselem.getElementsByTagName('ContentToReplace')[0]),
							'before' : SztakipediaClient.extractTextNonRecursive(iselem.getElementsByTagName('ContentBefore')[0]),
							'after' : SztakipediaClient.extractTextNonRecursive(iselem.getElementsByTagName('ContentAfter')[0])
						};
						break;
					case 'CharacterPositionBased':
						// TODO convert strings (e.g. {"begin" : "4"}) to integer ({"begin" : 4}) 
						suggestion['insertionstrategies']['characterpositionbased'] = SztakipediaClient.xmlAttributesAsHash(iselem);
						break;
				}
			}
			dialog['suggestions'][suggestion['id']] = suggestion;
		}

		list[dialog['id']] = dialog;
	}
	//alert('parseDialog: ' + JSON.stringify(list, null, 2));
	return list;
};

SztakipediaClient.parseSessionId = function(xml) {
	if (typeof xml == 'undefined')
		return undefined;
	var sessionid = SztakipediaClient.extractTextNonRecursive(xml.getElementsByTagName('session')[0]);
	if (typeof sessionid == 'undefined' || sessionid == null || sessionid == '')
		alert('ERROR: Failed to parse sessionid. (document element:' + xml.documentElement.tagName + ')');
	return sessionid;
};

SztakipediaClient.parseToken = function(xml) {
	if (typeof xml == 'undefined')
		return undefined;

	var token = SztakipediaClient.extractTextNonRecursive(xml.getElementsByTagName('Token')[0]);
	if (typeof token == 'undefined' || token == null || token == '')
		alert('ERROR: Failed to parse token. (document element:' + xml.documentElement.tagName + ')');

	return token;
};

// API FUNCTIONS
SztakipediaClient.queryProcessors = function(callback) {
	SztakipediaClient.doGet( {
		'action' : 'query',
		'meta' : 'processors'
	}, function(data) {
		callback(SztakipediaClient.parseProcessors(SztakipediaClient.parseXML(data)));
	});
};

SztakipediaClient.queryDialogBuilders = function(callback) {
	//	alert('queryDialogBuilders');
	SztakipediaClient.doGet( {
		'action' : 'query',
		'meta' : 'builders'
	}, function(data) {
		callback(SztakipediaClient.parseDialogBuilders(SztakipediaClient.parseXML(data)));
	});
};

SztakipediaClient.newSession = function(callback) {
	// check if there is a session open
	if (typeof SztakipediaClient.sessionid != 'undefined') {
		alert('WARNING: A session is still open, continuing anyway.');
		SztakipediaClient.sessionid = undefined; // clear previous session
		// TODO telling the server about the forgetting the old session by performing 'closeSession' action 
		// would be nice here.
	}

	SztakipediaClient.doGet( {
		'action' : 'login'
	}, function(data) {
		// Store session ID for future requests
			var sessionid = SztakipediaClient.parseSessionId(SztakipediaClient.parseXML(data));
			SztakipediaClient.sessionid = sessionid;
			//alert('Session id: ' + sessionid);
			callback(sessionid);
		});
};

SztakipediaClient.newToken = function(callback) {
	if (typeof SztakipediaClient.sessionid === 'undefined') {
		alert('WARNING: A session is not available, continuing anyway.');
	}
	SztakipediaClient.doGet( {
		'action' : 'requestToken',
		'sessionId' : (typeof SztakipediaClient.sessionid == 'undefined' ? '' : SztakipediaClient.sessionid)
	}, function(data) {
		var token = SztakipediaClient.parseToken(SztakipediaClient.parseXML(data));
		//		alert('Token: ' + token);
			callback(token);
		});
};

SztakipediaClient.update = function(callback, token, content, inputformat) {
	if (typeof SztakipediaClient.sessionid == 'undefined') {
		alert('WARNING: A session is not available, continuing anyway.');
	}
	inputformat = inputformat || 'wikitext';

	// FIXME use POST instead
	SztakipediaClient.doGet( {
		'action' : 'update',
		'token' : token,
		'contentFormat' : inputformat,
		'content' : content
	}, function(data) {
		//TODO process output of ?action=update
			callback(data); // TODO call with some meaningful info, e.g. editCount
		});
};

SztakipediaClient.buildDialogs = function(callback, token, dialogbuilder, builderparams) {
	if (typeof SztakipediaClient.sessionid == 'undefined') {
		alert('WARNING: A session is not available, continuing anyway.');
	}

	var params = {
		'action' : 'dialog',
		'builder' : dialogbuilder
	};
	// add token
	if (typeof token !== 'undefined') {
		params['token'] = token;
	}

	// add builder params
	if (typeof builderparams !== 'undefined') {
		for ( var key in builderparams)
			params['dpar_' + dialogbuilder + '_' + key] = builderparams[key];
	}

	SztakipediaClient.doGet(params, function(data) {
		callback(SztakipediaClient.parseDialog(SztakipediaClient.parseXML(data)));
	});
};

SztakipediaClient.buildList = function(callback, token, processor) {
	if (typeof SztakipediaClient.sessionid == 'undefined') {
		alert('WARNING: A session is not available, continuing anyway.');
	}

	SztakipediaClient.doGet( {
		'action' : 'list',
		'token' : token,
		'processor' : processor
	}, function(data) {
		callback(data); // TODO implement parseList
		});
};

SztakipediaClient.answerDialog = function(callback, token, builder, dialogId, suggestionId) {
	if (typeof SztakipediaClient.sessionid == 'undefined') {
		alert('WARNING: A session is not available, continuing anyway.');
	}

	SztakipediaClient.doGet( {
		'action' : 'answerDialog',
		'token' : token,
		'builder' : builder,
		'dialogId' : dialogId,
		'suggestionId' : suggestionId
	}, function(data) {
		callback(data); // data is empty by design
		});
};

SztakipediaClient.init = function() {
	if (SztakipediaClient.getOption('debug')) {
		// Provides cross-browser JSON serialization. For debugging purposes.
		// Usage: JSON.stringify(object, null, 2);
		// importScriptURI('https://raw.github.com/douglascrockford/JSON-js/master/json2.js'); // original
		importScriptURI('http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js'); // CDNJS HTTP mirror
	}
};

// Test
//SztakipediaClient.queryDialogBuilders ( function(obj) {
//	alert('Parsed: ' + JSON.stringify(obj, null, 2));
//});

SztakipediaClient.init();
