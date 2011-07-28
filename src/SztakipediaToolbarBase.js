// Global object
if (typeof SztakipediaTB == 'undefined') {
	var SztakipediaTB = {
		"Templates" : {}, // All templates
		"Suggestions" : {},
		"Options" : {}, // Global options
		"UserOptions" : {}, // User options
		"DefaultOptions" : {}, // Script defaults
		"ErrorChecks" : {}
	// Error check functions
	};
}

// Localized message text repository
if (typeof mw.usability == 'undefined') {
	mw.usability = {};
	mw.usability.getMsg = function(m) {
		return mw.messages.get(m);
	};
	mw.usability.addMessages = function(msgs) {
		mw.messages.set(msgs);
	};
}

// XML entity encode/decode by DracoBlue
//
// source: http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/
//
var xmlValue2EntityMap = {
	'&' : '&amp;',
	'"' : '&quot;',
	'<' : '&lt;',
	'>' : '&gt;'
};
function encodeXml(string) {
	return string.replace(/([\&"<>])/g, function(str, item) {
		return xmlValue2EntityMap[item];
	});
};
var xmlEntity2ValueMap = {
		'&amp;' : '&',
		'&quot;' : '"',
		'&lt;' : '<',
		'&gt;' : '>'
	};

function decodeXml(string) {
	return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g, function(str, item) {
		xmlEntity2ValueMap[item];
	});
}

function decodeXmlJ(str) {
	return $j('<div />').html(str.replace(/</g,'&lt;')).text();
}


//$("#image").change(function() {
//    var src = $(this).val();
//
//    $("#imagePreview").html(src ? "<img src='" + src + "'>" : "");
//});
// Add a .non-empty class to 
function adjustCssClassEmptiness() {
	if ($(this).val())
	{
		$(this).removeClass('empty');
		$(this).addClass('non-empty');
	}
	else
	{
		$(this).removeClass('non-empty');
		$(this).addClass('empty');
	}
}

// Object for cite templates
function sztakipediaTemplate(templatename, shortform, basicfields, expandedfields) {
	//alert("New template: " + templatename);
	// Properties
	this.templatename = templatename; // The template name - "cite web", "cite book", etc.
	this.shortform = shortform; // A short form, used for the dropdown box
	this.basic = basicfields; // Basic fields - author, title, publisher...
	// Less common - quote, archiveurl - should be everything the template supports minus the basic ones
	this.extra = expandedfields;
	
	this.refs = true;
	
	this.preview = true;

	// Add it to the list
	SztakipediaTB.Templates[this.templatename] = this;
	// Methods
	this.makeFormInner = function(fields) {
		var i = 0;
		var trs = new Array();
		for (i = 0; i < fields.length; i++) {
			var fieldobj = fields[i];
			var field = fieldobj.field;
			var ad = false;
			if ($j.inArray(field, SztakipediaTB.getOption('autodate fields')) != -1) {
				im = $j('<img />').attr('src', 'http://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Nuvola_apps_date.svg/20px-Nuvola_apps_date.svg.png');
				im.attr('alt', mw.usability.getMsg('sztakipedia-insert-date')).attr('title', mw.usability.getMsg('sztakipedia-insert-date'));
				var ad = $j('<a />').attr('href', '#');
				ad.append(im);
				ad.attr('id', 'sztakipedia-date-' + SztakipediaTB.escStr(this.shortform) + '-' + field);
				$j('#sztakipedia-date-' + SztakipediaTB.escStr(this.shortform) + '-' + field).live('click', SztakipediaTB.fillAccessdate);
			}

			if (fieldobj.autofillid) {
				var autotype = fieldobj.autofillid;
				im = $j('<img />').attr('src', 'http://upload.wikimedia.org/wikipedia/commons/thumb/1/17/System-search.svg/18px-System-search.svg.png');
				im.attr('alt', mw.usability.getMsg('sztakipedia-autofill-alt')).attr('title', mw.usability.getMsg('sztakipedia-autofill-alt'));
				var ad = $j('<a />').attr('href', '#');
				ad.append(im);
				ad.attr('id', 'sztakipedia-auto-' + SztakipediaTB.escStr(this.shortform) + '-' + field + '-' + autotype);
				$j('#sztakipedia-auto-' + SztakipediaTB.escStr(this.shortform) + '-' + field + '-' + autotype).live('click', SztakipediaTB.initAutofill);
			}

			var display = mw.usability.getMsg('sztakipedia-' + field + '-label');
			// FIXME if (typeof display == 'undefined' || display == '' || display == false)
			display = SztakipediaTB.fixStr(field);
			var tooltip = fieldobj.tooltip ? $j('<abbr />').attr('title', mw.usability.getMsg(fieldobj.tooltip) || decodeXmlJ(fieldobj.tooltip)).text('*').addClass('sztakipedia-field-tooltip') : false;

			var input = '';
			if (ad) {
				input = $j('<input tabindex="1" style="width:82%" type="text" />&nbsp;');
			} else {
				input = $j('<input tabindex="1" style="width:100%" type="text" />');
			}
			input.attr('id', 'sztakipedia-' + SztakipediaTB.escStr(this.shortform) + '-' + field);
			if (fieldobj.autofillprop) {
				input.addClass('sztakipedia-' + SztakipediaTB.escStr(this.shortform) + '-' + fieldobj.autofillprop);
			}
			input.change(adjustCssClassEmptiness).change();
			var label = $j('<label />');
			label.attr('for', 'sztakipedia-' + SztakipediaTB.escStr(this.shortform) + '-' + field).text(display);
			label.attr('title', 'raw field name: ' + field);
			if (tooltip) {
				label.append(tooltip);
			}
			var style = 'text-align:right; width:20%;';
			if (i % 2 == 1) {
				style += ' padding-left:1em;';
			} else {
				var tr = $j('<tr />');
			}
			var td1 = $j('<td class="sztakipedia-form-td" />').attr('style', style);
			td1.append(label);
			tr.append(td1);
			var td2 = $j('<td class="sztakipedia-form-td" style="width:30%" />');
			td2.append(input);
			if (ad) {
				td2.append(ad);
			}
			tr.append(td2);
			if (i % 2 == 0) {
				trs.push(tr);
			}
		}
		return trs;

	};

	// gives a little bit of HTML so the open form can be identified
	this.getInitial = function() {
		var hidden = $j('<input type="hidden" class="sztakipedia-template" />');
		hidden.val(this.templatename);
		return hidden;
	};

	// makes the form used in the dialog boxes
	this.getForm = function() {
		var main = $j("<div class='sztakipedia-form-container' />");
		var form1 = $j('<table style="width:90%; background-color:transparent;" class="sztakipedia-basic-fields" />');
		var i = 0;
		var trs = this.makeFormInner(this.basic);
		for ( var i = 0; i < trs.length; i++) {
			form1.append(trs[i]);
		}

		var form2 = $j('<table style="width:100%; background-color:transparent; display:none" class="sztakipedia-extra-fields">');
		trs = this.makeFormInner(this.extra);
		for ( var i = 0; i < trs.length; i++) {
			form2.append(trs[i]);
		}
		main.append(form1).append(form2);

		if (this.refs) {
			var form3 = $j('<table style="width:95%; background-color:transparent;padding-top:1em" class="sztakipedia-other-fields">');
			var tr = $j('<tr />');
			var td1 = $j('<td class="sztakipedia-form-td" style="text-align:right; width:20%" />');
			var label1 = $j('<label />');
			label1.attr('for', 'sztakipedia-' + SztakipediaTB.escStr(this.shortform) + '-name').text(mw.usability.getMsg('sztakipedia-name-label'));
			td1.append(label1);
			var td2 = $j('<td class="sztakipedia-form-td" style="width:30%" />');
			var input1 = $j('<input tabindex="1" style="width:auto" type="text" />');
			input1.attr('id', 'sztakipedia-' + SztakipediaTB.escStr(this.shortform) + '-name');
			td2.append(input1);
			var td3 = $j('<td class="sztakipedia-form-td" style="text-align:right; padding-left:1em; width:20%">');
			var label2 = $j('<label />');
			label2.attr('for', 'sztakipedia-' + SztakipediaTB.escStr(this.shortform) + '-group').text(mw.usability.getMsg('sztakipedia-group-label'));
			td3.append(label2);
			var td4 = $j('<td class="sztakipedia-form-td" style="width:30%" />');
			var input2 = $j('<input tabindex="1" style="width:auto" type="text" />');
			input2.attr('id', 'sztakipedia-' + SztakipediaTB.escStr(this.shortform) + '-group');
			td4.append(input2);
			tr.append(td1).append(td2).append(td3).append(td4);
			form3.append(tr);
			main.append(form3);
		}
		var extras = $j('<div />');
		extras.append('<input type="hidden" class="sztakipedia-form-status" value="closed" />');
		var hidden = $j('<input type="hidden" class="sztakipedia-template" />');
		hidden.val(this.templatename);
		extras.append(hidden);
		
		if (this.preview) {
			var span1 = $j('<span class="sztakipedia-preview-label" style="display:none;" />');
			span1.text(mw.usability.getMsg('sztakipedia-raw-preview'));
			extras.append(span1).append('<div class="sztakipedia-ref-preview" style="padding:0.5em; font-size:110%" />');
			var span2 = $j('<span class="sztakipedia-prev-parsed-label" style="display:none;" />');
			span2.text(mw.usability.getMsg('sztakipedia-parsed-label'));
			extras.append(span2).append('<div class="sztakipedia-preview-parsed" style="padding-bottom:0.5em; font-size:110%" />');
			var link = $j('<a href="#" class="sztakipedia-prev-parse" style="margin:0 1em 0 1em; display:none; color:darkblue" />');
			link.text(mw.usability.getMsg('sztakipedia-form-parse'));
			extras.append(link);
		}
		
		main.append(extras);

		return main;
	};
}

/*
 * Class for error checks FIXME: DOCS OUT OF DATE type - type of error check -
 * current options: 'refcheck' - apply a function on each ref individually
 * function should accept a ref object, return a string 'reflist' - apply a
 * function on the entire ref list function should accept an array of ref
 * objects, return an array of strings 'search' - apply a function ro the page
 * text function should accept the page text as a string, return an array of
 * strings The strings returned by the function should be valid HTML
 * 
 * func - The function described above testname - Name of the error check, must
 * not contain spaces desc - A short description of the test
 */

//function sztakipediaErrorCheck(obj) {
//	this.obj = obj;
//	SztakipediaTB.ErrorChecks[this.obj.testname] = this;
//
//	this.run = function() {
//		var errors = [];
//		switch (this.obj['type']) {
//		case "refcheck":
//			SztakipediaTB.loadRefs();
//			for ( var i = 0; i < SztakipediaTB.mainRefList.length; i++) {
//				var e = this.obj.func(SztakipediaTB.mainRefList[i]);
//				if (e) {
//					errors.push(e);
//				}
//			}
//			break;
//		case "reflist":
//			SztakipediaTB.loadRefs();
//			errors = this.obj.func(SztakipediaTB.mainRefList);
//			break;
//		case "search":
//			var func = this.obj.func;
//			SztakipediaTB.getPageText(function(text) {
//				errors = func(text);
//			});
//			break;
//		}
//		return errors;
//	};
//
//	this.getRow = function() {
//		var row = $j("<li />");
//		var check = $j("<input type='checkbox' name='sztakipedia-err-test' />");
//		check.attr('value', this.obj.testname);
//		var label = $j("<label />").html(mw.usability.getMsg(this.obj.desc));
//		label.attr('for', this.obj.testname);
//		row.append(check).append(' &ndash; ').append(label);
//		return row;
//	};
//}

$j('head').trigger('sztakipediatoolbarbase');