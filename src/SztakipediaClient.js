/**
 * @license Copyright 2011 MTA SZTAKI
 * GNU General Public License v2.0 or later 
 */

// Global object
if (typeof SztakipediaClient == 'undefined') {
	/**
	 * @namespace Offers convenient interface to the Sztakipedia REST API services.
	 * @requires jQuery
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
 * @type Object
 */
SztakipediaClient.DefaultOptions = {
	'api url' : "http://pedia.sztaki.hu/SWEA-Server/REST/sztakipedia", // The RESTful API endpoint
	//	'json proxy url' : "http://localhost:8080/json-proxy/", // JSONP proxy for cross-site requests
	'debug' : true
// whether to produce debugging output
};

/**
 * Get an option - user settings override global which override defaults
 * @param {string} opt The name of the option.
 * @return string The value of the option.
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
 * @param data {string} the XML as a string
 * @return Object the XML DOM, or <code>undefined</code> if <code>data</code> is <code>undefined</code>
 */
SztakipediaClient.parseXML = function(data) {
	if (typeof data == 'undefined')
		return undefined;
	var xml, tmp;

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
 * @param {Node} elem The DOM element.
 * @return Object
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
 * @param {Node} elem The DOM element.
 * @return Object
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
 * Get the string representation of a DOM XML node.
 * @see adapted from http://forum.jquery.com/topic/jquery-serializing-xml#14737000000169757
 * @param {Node} elem The DOM element.
 */
SztakipediaClient.serializeXML = function(elem) {
    var out;
    if (typeof XMLSerializer === 'function') { // modern browsers
        var xs = new XMLSerializer();
        out = xs.serializeToString(elem);
    } else if (elem && elem.xml !== 'undefined') { // IE
        out = elem.xml;
    }
    return out;
};

/**
 * Concatenate text nodes inside the element.
 * @param {Node} elem The DOM element.
 * @return string
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
 * @param {Node} elem The DOM element. 
 * @return string
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
 * @param {Object} params A key-value map of the HTTP parameters. 
 * @private
 * @return string The URL to query the remote REST API.
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
 * Perform a GET request to the API endpoint.
 * 
 * For JSONP requests, the API response always returns a HTTP 200 OK status, while indicating actual status code (and probably error message) in the payload as follows.
 * For successful requests:
 * <blockquote>
 * <code>json123(['...content...', 200])</code>
 * </blockquote>
 * For unsuccessful requests:
 * <blockquote>
 * <code>json123([null, 5xx, '...error...'])</code>
 * </blockquote>
 * @param {Object} params The HTTP request parameters to be passed.
 * @param {function((string|undefined))} [callback] The function to be called with the HTTP response content {@link String}, or undefined on failure.
 * @private
 */
SztakipediaClient.doGet = function(params, callback) {
	var url = SztakipediaClient.queryUrl(params);
	$j.ajax( {
		'url' : url,
		'dataType' : 'jsonp',
		'jsonp' : 'callback',
		'success' : function(data) {

			//alert(JSON.stringify(data, null, 2));

		
			//alert("RAW: " + data);
			var content = data[0], 
				status = data[1], 
				error = (data.length > 2 ? data[2] : undefined);
			
			if (!(typeof error == 'undefined' || error == null)) {
				if (SztakipediaClient.getOption('debug'))
					alert('HTTP error ' + status + ' while retrieving "' + url + '": ' + JSON.stringify(data, null, 2));
				
				throw 'HTTP error ' + status + ' while retrieving "' + url + '"';
			}
			callback(content);
		}
	});
};

// PARSER FUNCTIONS (XML -> Javascript)
/**
 * Retrieve the list of available processors from the response DOM element.
 * @param {Object} xml The XML DOM element to be processed.
 * @function
 * @return Object List of available processors.
 * @private
 */
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

/**
 * Retrieve the list of available dialog builders from the response DOM element.
 * @param {Object} xml The XML DOM element to be processed.
 * @return Object List of available dialog builders.
 * @private
 */
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

/**
 * Retrieve the list of dialogs from the response DOM element.
 * @param {Object} xml The XML DOM element to be processed.
 * @return Object List of dialogs.
 * @private
 */
SztakipediaClient.parseDialog = function(xml) {
	if (typeof xml === 'undefined' || xml === null)
		throw "Undefined";
	
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

			if (suggestionelem.getElementsByTagName('Details').length) {
				var details = SztakipediaClient.extractTextNonRecursive(suggestionelem.getElementsByTagName('Details')[0]);
				if (details)
					suggestion['details'] = details;
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
					case 'SourcePosition':
						// TODO convert strings (e.g. {"begin" : "4"}) to integer ({"begin" : 4}) 
						suggestion['insertionstrategies']['sourceposition'] = SztakipediaClient.xmlAttributesAsHash(iselem);
						break;
					case 'CharacterPositionBased':
						// TODO convert strings (e.g. {"begin" : "4"}) to integer ({"begin" : 4}) 
						suggestion['insertionstrategies']['characterpositionbased'] = SztakipediaClient.xmlAttributesAsHash(iselem);
						break;
					case 'AbsolutePosition':
						suggestion['insertionstrategies']['absolute'] = SztakipediaClient.xmlAttributesAsHash(iselem);
						break;
					default:
						if (iselem.nodeType === Node.ELEMENT_NODE) {				
				 			if (SztakipediaClient.getOption('debug')) {
				 				alert("Unrecognized insertion policy in init: " + iselem.tagName + "\n" + SztakipediaClient.serializeXML(iselem));
								throw "Unrecognized insertion policy: " + iselem.tagName;
				 			}
						}
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

/**
 * Retrieve the session ID from the response DOM element.
 * @param {Object} xml The XML DOM element to be processed.
 * @return string The session ID.
 * @private
 * 
 */
SztakipediaClient.parseSessionId = function(xml) {
	if (typeof xml == 'undefined')
		return undefined;
	var sessionid = SztakipediaClient.extractTextNonRecursive(xml.getElementsByTagName('session')[0]);
	if (typeof sessionid == 'undefined' || sessionid == null || sessionid == '')
		alert('ERROR: Failed to parse sessionid. (document element:' + xml.documentElement.tagName + ')');
	return sessionid;
};

/**
 * Retrieve the token from the response DOM element.
 * @param {Object} xml The XML DOM element to be processed.
 * @function
 * @return string The token.
 * @private
 */
SztakipediaClient.parseToken = function(xml) {
	if (typeof xml == 'undefined')
		return undefined;

	var token = SztakipediaClient.extractTextNonRecursive(xml.getElementsByTagName('Token')[0]);
	if (typeof token == 'undefined' || token == null || token == '')
		alert('ERROR: Failed to parse token. (document element:' + xml.documentElement.tagName + ')');

	return token;
};

/* PUBLIC METHODS */
/**
 * Retrieve available processors through remote REST API.
 * @param {function(Object)|function()} callback The function to be called with the resulting array. 
 * @public
 * @return Object
 */
SztakipediaClient.queryProcessors = function(callback) {
	SztakipediaClient.doGet( {
		'action' : 'query',
		'meta' : 'processors'
	}, function(data) {
		callback(SztakipediaClient.parseProcessors(SztakipediaClient.parseXML(data)));
	});
};

/**
 * Retrieve available dialog builders through remote REST API.
 * @param {function(Object)|function()} callback The function to be called with the resulting array. 
 * @public
 * @return Object
 */
SztakipediaClient.queryDialogBuilders = function(callback) {
	//	alert('queryDialogBuilders');
	SztakipediaClient.doGet( {
		'action' : 'query',
		'meta' : 'builders'
	}, function(data) {
		callback(SztakipediaClient.parseDialogBuilders(SztakipediaClient.parseXML(data)));
	});
};

/**
 * Start new session.
 * @param {function(string)|function()} callback The function to be called with the resulting session ID. 
 * @public
 * @return string
 * 
 */
SztakipediaClient.newSession = function(callback, user) {
	// check if there is a session open
	if (typeof SztakipediaClient.sessionid != 'undefined') {
		alert('WARNING: A session is still open, continuing anyway.');
		SztakipediaClient.sessionid = undefined; // clear previous session
		// TODO telling the server about the forgetting the old session by performing 'closeSession' action 
		// would be nice here.
	}

	SztakipediaClient.doGet( {
		'action' : 'login',
		'user' : user
	}, function(data) {
		// Store session ID for future requests
			var sessionid = SztakipediaClient.parseSessionId(SztakipediaClient.parseXML(data));
			SztakipediaClient.sessionid = sessionid;
			//alert('Session id: ' + sessionid);
			callback(sessionid);
		});
};

/**
 * Request a new token for submitting a wikitext fragment.
 * @param {function(string)|function()} callback The function to be called with the resulting token. 
 * @public
 * @return string
 */
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

/**
 * Replace remotely stored wikitext associated with the given token.
 * @param {function()} callback The function to be called with nothing. 
 * @param {string} token The token of the wikitext to be updated.
 * @param {string} content The new wikitext. 
 * @param {string} [inputformat]  
 * @public
 */
SztakipediaClient.update = function(callback, token, content, inputformat) {
	if (typeof SztakipediaClient.sessionid == 'undefined') {
		alert('WARNING: A session is not available, continuing anyway.');
	}
	inputformat = inputformat || 'wikitext';

	// TODO use POST instead
	SztakipediaClient.doGet( {
		'action' : 'update',
		'token' : token,
		'contentFormat' : inputformat,
		'content' : content
	}, function(data) {
		//TODO process output of ?action=update
			callback(); // TODO call with some meaningful info, e.g. editCount
		});
};

/**
 * Request suggestions from the given dialog builders through remote REST API.
 * @param {function(Object)|function()} callback The function to be called with the resulting array of dialogs. 
 * @param {string} token The token of the wikitext to be processed.
 * @param {string} dialogbuilder The unique name of the dialog builder. 
 * @param {Object} [builderparams] The unique name of the dialog builder. 
 * @public
 */
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

/**
 * Request entities from the given text processor through remote REST API.
 * @param {function(Object)|function()} callback The function to be called with the resulting array of entities.
 * @param {string} token The token of the wikitext to be processed.
 * @param {string} processor The unique name of the processor. 
 * @public
 * @deprecated Response processing not implemented.
 */
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

/**
 * Signal that the user accepted a suggestion towards the remote REST API.
 * 
 * @param {function()} callback The function to be called with nothing.
 * @param {string} token The token of the wikitext to be processed.
 * @param {string} builder The unique name of the builder. 
 * @param {string} dialogId The identifier of the dialog. 
 * @param {string} suggestionId The identifier of the suggestion being accepted. 
 */
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
		callback(); // data is empty by design
		});
};

/**
 * Perform one-time initialization.
 */
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
