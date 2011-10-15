

// Global object
if (typeof SztakipediaTB == 'undefined') {
	/**
	 * @namespace Provides a toolbar for WikiEditor with tools to easily insert links, categories, references, etc.
	 * @requires SztakipediaClient
	 * @requires sztakipediaTemplate
	 * @requires MediaWiki-UI
	 * @requires jQuery
	 * @public 
	 */
	var SztakipediaTB = {
		/**
		 * All {@link sztakipediaTemplate} objects.
		 * @field
		 * @type Object
		 * @name SztakipediaTB.Templates
		 */
		"Templates" : {},
		/**
		 * All dialogs.
		 * @field
		 * @type Object
		 * @name SztakipediaTB.Dialogs
		 */
		"Dialogs" : {},

		/**
		 * Site-wide options that override {@link SztakipediaTB.DefaultOptions}, and are overidden by {@link SztakipediaTB.UserOptions}.
		 * @field
		 * @type Object
		 * @name SztakipediaTB.Options
		 */		
		"Options" : {}, // Global options
		
		/**
		 * User options that override {@link SztakipediaTB.DefaultOptions} and {@link SztakipediaTB.Options}.
		 * @field
		 * @type Object
		 * @name SztakipediaTB.UserOptions
		 * @public
		 */		
		"UserOptions" : {}, // User options
		
		/**
		 * Global default options that are overidden by  {@link SztakipediaTB.Options} and by {@link SztakipediaTB.UserOptions}.
		 * It mainly exist so the script won't break if a new option is added.
		 * @field
		 * @type Object
		 * @name SztakipediaTB.DefaultOptions
		 * @private
		 */				
		"DefaultOptions" : {} // Script defaults
	};
	window['SztakipediaTB'] = SztakipediaTB; // export name to be preserved
	
	;
		
}

//// JsonML (JSON => XML DOM) FIXME HACK
//importScriptURI('http://pediadev.sztaki.hu/~illes/SztakipediaToolbar/JsonML2.js');

// only load on edit, unless its a user JS/CSS page
if ((wgAction == 'edit' || wgAction == 'submit') 
		&& !((wgNamespaceNumber == 2 || wgNamespaceNumber == 4) 
				&& (wgPageName.indexOf('.js') != -1 || wgPageName.indexOf('.css') != -1))) {

	appendCSS(".sztakipedia-form-td {" + "height: 0 !important;" + "padding: 0.1em !important;" + "}");
	appendCSS(".sztakipedia-form-td label {" + "padding-left: 1.5em !important;" + "white-space: nowrap;" + "}");
	appendCSS(".sztakipedia-field-tooltip {" + "color: navy;" + "}");
	appendCSS(".sztakipedia-ref-preview {" + "font-family: monospace;" + "}");
	appendCSS(".sztakipedia-ref-preview, .sztakipedia-preview-parsed {" + "padding: 0em 1em;" + "}");
	appendCSS(".ui-widget {" + "font-size: 0.75em;" + "}");	
	appendCSS(".ui-dialog {" + "max-height: 90%;" + "}");	
	appendCSS(".ui-dialog-content {" + "overflow: hidden;" + "}");
	appendCSS(".ui-dialog-content input {" + "padding:4px 2px;" + "border:solid 1px #aacfe4;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-info-id {" + "font-weight: bold;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-dialogs, .sztakipedia-form-container {" + "display: block;" + "height: 350px;" + "overflow: auto;" + "margin: 2px;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-dialog-block {" + "display: block;" + "border: 1px solid #AED0EA;" + "background-color: white;"+ "margin-bottom: 0.5em;"
			+ "padding: 0.2em 0.2em;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-search-form {" + "display: block;" + "border: 1px solid #AED0EA;" + "background-color: #EEE;"+ "margin-bottom: 0.5em;"
			+ "padding: 0.2em;" + "padding-right: 0.5em;" + "}");
	appendCSS("input.sztakipedia-checkbox, label.sztakipedia-checkbox {" + "vertical-align: middle;" + "}");
	
	appendCSS(".ui-dialog-content .sztakipedia-dialog-block ul li {" + "list-style: none outside none;" + "margin: 8px;" + "}");
	appendCSS(".ui-dialog-content ul {" + "margin: 0px;" + "padding: 0px;" + "}");
	
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-container {" + "width: 95%;" + "overflow: hidden;" + "}"); // http://www.quirksmode.org/css/clearing.html
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-text-container {" + "float: left;" + "width: 85%;" + "/*border: 1px dotted red;*/" + "}"); // http://www.quirksmode.org/css/clearing.html
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-image-container {" + "float: right;" + "width: 10%;" + "/*border: 1px dotted red;*/" + "}"); // http://www.quirksmode.org/css/clearing.html
	
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-image-container {" + "padding-right: 0.2em;" + "}");
	
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-text {" + "color: #0645AD;" + "font-size: 120%;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-details {" + "color: #0E774A;" + "display: block;" + "font-size: 75%;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-meta {" + "color: #0E774A;" + "display: block;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-snippet {" + "color: black;" + "display: block;" + "padding-top: 0.1em;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-snippet b {" + "background-color: #FFCCCC;" + "padding: 0em 0.2em;" + "}");
	appendCSS(".ui-dialog-content img.sztakipedia-suggestion-thumbnail {" + "background-color: white;" + "/*border: 1px solid #0645AD;*/" + "padding: 1px;" + "width: 40px;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-actions {" + "display: block;" + "padding-top: .1em;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-action {" + "color: #3366CC;" + "opacity: .30;" + "text-decoration: none;" + "margin-right: 1em;"+ "}");
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-action-title {" + "text-decoration: underline;" + "margin-left: .2em;"+ "}");
	appendCSS(".ui-dialog-content .sztakipedia-suggestion-action:hover {" + "opacity: 1;" + "}");
	appendCSS(".ui-dialog-content .sztakipedia-dialog-block-title, .sztakipedia-prev-parsed-label, .sztakipedia-preview-label {" + "font-weight: bold;" +  "margin-bottom: 0.3em;" + "}");

	//appendCSS('.ui-dialog-content input.non-empty {' +"background-color: red;" + "}"); TODO fix higlighting of non.empty fields

	SztakipediaTB.DefaultOptions = {
		"date format" : "<year>-<zmonth>-<zdate>",
		"autodate fields" : [],
		"months" : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
		"modal" : true,
		"autoparse" : false,
		"expandtemplates" : false,
		"debug" : false,
		"basedir" : "http://pedia.sztaki.hu/SztakipediaToolbar/",
		"anonymous" : true
	};
	SztakipediaTB['DefaultOptions'] = SztakipediaTB.DefaultOptions; // export name for Closure 
	
	/**
	 * Get an option - user settings override site-wide which override defaults.
	 * @param {string|undefined} opt The name of the option.
	 * @return {string} The value of the option.
	 */
	SztakipediaTB.getOption = function(opt) {
		if (SztakipediaTB.UserOptions[opt] != undefined) {
			return SztakipediaTB.UserOptions[opt];
		}
		else if (SztakipediaTB.Options[opt] != undefined) {
			return SztakipediaTB.Options[opt];
		}
		return SztakipediaTB.DefaultOptions[opt];
	};


	/**
	 * The textarea to attach to.
	 * @return {jQuery|wikiEditor} The jQuery DOM element of the main text input field.
	 */
	SztakipediaTB.getTarget = function() {
		return $j('#wpTextbox1');
	};

	/**
	 * Create a WikiEditor dialog from a {@link sztakipediaTemplate} object.
	 * @param {Object} tem The {@link sztakipediaTemplate} object to create a dialog for.
	 * @return {Object} A WikiEditor-style dialog descriptor.  
	 */
	SztakipediaTB.toDialog = function(tem) {
		var sform = SztakipediaTB.escStr(tem.shortform);
		var dialogid = 'sztakipedia-dialog-' + sform;
		var dialog = {
			resizeme : false,
			titleMsg : dialogid,
			id : 'sztakipediatoolbar-' + sform,
			init : function() {
			},
			html : tem.getInitial(),
			dialog : {
				width : 675,
				open : function() {
					$j(this).html(SztakipediaTB.getOpenTemplate().getForm());
					$j('.sztakipedia-prev-parse').bind('click', SztakipediaTB.prevParseClick);
				},
				beforeclose : function() {
					SztakipediaTB.resetForm();
				},
				buttons : {
					'sztakipedia-form-submit' : function() {
						$j.wikiEditor.modules.toolbar.fn.doAction($j(this).data('context'), {
							type : 'encapsulate',
							options : {
								peri : ' '
							}
						}, $j(this));
						var ref = SztakipediaTB.getRef(false, true);
						$j(this).dialog('close');
						$j.wikiEditor.modules.toolbar.fn.doAction($j(this).data('context'), {
							type : 'encapsulate',
							options : {
								pre : ref
							}
						}, $j(this));
					},
					'sztakipedia-form-showhide' : SztakipediaTB.showHideExtra,
					'wikieditor-toolbar-tool-link-cancel' : function() {
						$j(this).dialog('close');
					},
					'sztakipedia-form-reset' : function() {
						SztakipediaTB.resetForm();
					}
				}
			}
		};
		
		if (tem.preview)
			dialog['dialog']['buttons']['sztakipedia-refpreview'] = function() {
				var template = SztakipediaTB.getOpenTemplate();
				var ref = SztakipediaTB.getRef(!template.refs, false);
				var div = $j("#sztakipediatoolbar-" + sform);
				div.find('.sztakipedia-preview-label').show();
				div.find('.sztakipedia-ref-preview').text(ref).show();
				
				var container = div.find('.sztakipedia-form-container');
				var	scrollTo = div.find('.sztakipedia-ref-preview');

	
				if (SztakipediaTB.getOption('autoparse')) {
					SztakipediaTB.scrollTo(scrollTo, container);
					SztakipediaTB.prevParseClick();
				}
				else {
					SztakipediaTB.scrollTo(scrollTo, container, 'fast');
					
					div.find('.sztakipedia-prev-parse').show();
					div.find('.sztakipedia-prev-parsed-label').hide();
					div.find('.sztakipedia-preview-parsed').html('');
				}
			};
		return dialog;
	};

	/**
	 * Initialize the book reference insertion tool.
	 * @private
	 */
	SztakipediaTB.initBook = function() {

		// Add dialog
		var bookDialog = {
			'sztakipedia-toolbar-dialog-bookprediction' : {
				titleMsg : 'sztakipedia-dialog-bookprediction-title',
				id : 'sztakipediatoolbar-dialog-bookprediction',
				resizeme : false,
				init : function() {
				},
				html :
					'<div id="sztakipediatoolbar-dialog-bookprediction-form"/>'+
					'<div id="sztakipediatoolbar-dialog-bookprediction-content" class="sztakipedia-dialogs">' 
						+ '<div id="sztakipedia-dialog-bookprediction-loading">' 
						+ '<img src="http://upload.wikimedia.org/wikipedia/commons/4/42/Loading.gif" />' 
						+ '&nbsp;' + SztakipediaTB.getMsgPlaceholder('sztakipedia-loading') + '</div>'
						+ '</div>',
				dialog : {
					width : 550,
					open : function() {
						SztakipediaTB.loadBookSuggestions();
					},
					buttons : {
						'sztakipedia-search-form-submit' : SztakipediaTB.handleBookFormSubmit,		
						'sztakipedia-form-showhide' : SztakipediaTB.showHideExtra,						
						'wikieditor-toolbar-tool-link-cancel' : function() {
							$j(this).dialog('close');
						},
						'sztakipedia-form-reset' : function() {
							SztakipediaTB.resetForm();
						}						
					}
				}
			}
		};
		SztakipediaTB.getTarget().wikiEditor('addDialog', bookDialog);

		// To add a button to an existing toolbar group:        
		SztakipediaTB.getTarget().wikiEditor('addToToolbar', {
			'section' : 'sztakipedias',
			'group' : 'suggestions',
			'tools' : {
				'bookprediction' : {
					label : 'Book', // FIXME use labelMsg for a localized label
					type : 'button',
					icon : 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nuvola_apps_bookcase.svg/22px-Nuvola_apps_bookcase.svg.png',
					//					action : {
					//						type : 'callback',
					//						execute : function(context) {
					//							alert('remove');
					//							SztakipediaTB.target.wikiEditor('removeFromToolbar', {
					//								'section' : 'sztakipedias',
					//								'group' : 'suggestions',
					//								'tool' : 'book'
					//							});
					//						}
					//					},

					//					action : {
					//						type : 'encapsulate',
					//						options : {
					//							pre : "{{cite book}}" // text to be inserted
					//					}
					action : {
						type : 'dialog',
						module : 'sztakipedia-toolbar-dialog-bookprediction'
					}
				}
			}
		});
	};

	/**
	 * Initialize the internal link insertion tool.
	 * @private
	 */
	SztakipediaTB.initLink = function() {

		// Add dialog
		var linkDialog = {
			'sztakipedia-toolbar-dialog-link' : {
				titleMsg : 'sztakipedia-dialog-link-title',
				id : 'sztakipediatoolbar-dialog-link',
				resizeme : false,
				init : function() {
				},
				html : '<div id="sztakipediatoolbar-dialog-link-content" class="sztakipedia-dialogs">' 
					+ '<div id="sztakipedia-dialog-link-loading">' 
					+ '<img src="http://upload.wikimedia.org/wikipedia/commons/4/42/Loading.gif" />' 
					+ '&nbsp;' + SztakipediaTB.getMsgPlaceholder('sztakipedia-loading') + '</div>'
					+ '</div>',
				dialog : {
					width : 550,
					open : function() {
						SztakipediaTB.loadLinkSuggestions();
					},
					buttons : {
						'wikieditor-toolbar-tool-link-cancel' : function() {
							$j(this).dialog('close');
						}
					}
				}
			}
		};
		SztakipediaTB.getTarget().wikiEditor('addDialog', linkDialog);

		//		// FIXME for testing
		//		// To add a group to an existing toolbar section:
		//		SztakipediaTB.getTarget().wikiEditor('addToToolbar', {
		//			'section' : 'sztakipedias',
		//			'groups' : {
		//				'suggestions' : {
		//					'label' : 'Suggestions' // FIXME use labelMsg for a localized label
		//				}
		//			}
		//			});
		// To add a button to an existing toolbar group:        
		SztakipediaTB.getTarget().wikiEditor('addToToolbar', {
			'section' : 'sztakipedias',
			'group' : 'suggestions',
			'tools' : {
				'link' : {
					label : 'Internal link', // FIXME use labelMsg for a localized label
					type : 'button',
					icon : 'http://svn.wikimedia.org/svnroot/mediawiki/branches/wmf-deployment/extensions/UsabilityInitiative/images/wikiEditor/toolbar/insert-ilink.png',
					//					action : {
					//						type : 'callback',
					//						execute : function(context) {
					//							alert('remove');
					//							SztakipediaTB.target.wikiEditor('removeFromToolbar', {
					//								'section' : 'sztakipedias',
					//								'group' : 'suggestions',
					//								'tool' : 'book'
					//							});
					//						}
					//					},
					//					action : {
					//						type : 'encapsulate',
					//						options : {
					//							pre : "{{cite book}}" // text to be inserted
					//					}
					action : {
						type : 'dialog',
						module : 'sztakipedia-toolbar-dialog-link'
					}
				}
			}
		});
	};

	/**
	 * Initialize the category link insertion tool.
	 * @private
	 */
	SztakipediaTB.initCategory = function() {

		// Add dialog
		var catDialog = {
			'sztakipedia-toolbar-dialog-category' : {
				titleMsg : 'sztakipedia-dialog-category-title',
				id : 'sztakipediatoolbar-dialog-category',
				resizeme : false,
				init : function() {
				},
				html : '<div id="sztakipedia-dialog-category-loading">' + '<img src="http://upload.wikimedia.org/wikipedia/commons/4/42/Loading.gif" />' + '&nbsp;'
						+ mw.usability.getMsg('sztakipedia-loading') + '</div>',
				dialog : {
					width : 550,
					open : function() {
						SztakipediaTB.loadCategorySuggestions();
					},
					buttons : {
						'wikieditor-toolbar-tool-link-cancel' : function() {
							$j(this).dialog('close');
						}
					}
				}
			}
		};
		SztakipediaTB.getTarget().wikiEditor('addDialog', catDialog);

		// To add a button to an existing toolbar group:        
		SztakipediaTB.getTarget().wikiEditor('addToToolbar', {
			'section' : 'sztakipedias',
			'group' : 'suggestions',
			'tools' : {
				'category' : {
					label : 'Category', // FIXME use labelMsg for a localized label
					type : 'button',
					icon : //'http://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Nuvola_filesystems_folder_cyan.png/22px-Nuvola_filesystems_folder_cyan.png', 
						//'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Venn_diagram_coloured.svg/22px-Venn_diagram_coloured.svg.png',
					//'http://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Categorisation-hierarchy-top2down.svg/22px-Categorisation-hierarchy-top2down.svg.png', 
//					'http://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Nuvola_apps_katomic.svg/22px-Nuvola_apps_katomic.svg.png',
					'http://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Nuvola_apps_ipo.svg/22px-Nuvola_apps_ipo.svg.png',
					action : {
						type : 'dialog',
						module : 'sztakipedia-toolbar-dialog-category'
					}
				}
			}
		});
	};

	/**
	 * Initialize the infobox insertion tool.
	 * @private
	 */
	SztakipediaTB.initInfobox = function() {
		// Add dialog
		var infoboxDialog = {
			'sztakipedia-toolbar-dialog-infobox' : {
				titleMsg : 'sztakipedia-dialog-infobox-title',
				id : 'sztakipediatoolbar-dialog-infobox',
				resizeme : false,
				init : function() {
				},
				html : '<div id="sztakipediatoolbar-dialog-infobox-content" class="sztakipedia-dialogs">' 
					+ '<div id="sztakipedia-dialog-infobox-loading">' 
					+ '<img src="http://upload.wikimedia.org/wikipedia/commons/4/42/Loading.gif" />' 
					+ '&nbsp;' + SztakipediaTB.getMsgPlaceholder('sztakipedia-loading') + '</div>'
					+ '</div>',
				dialog : {
					width : 550,
					open : function() {
						SztakipediaTB.loadInfoboxSuggestions();
					},
					buttons : {
						'wikieditor-toolbar-tool-link-cancel' : function() {
							$j(this).dialog('close');
						}
					}
				}
			}
		};
		SztakipediaTB.getTarget().wikiEditor('addDialog', infoboxDialog);

		// To add a button to an existing toolbar group:        
		SztakipediaTB.getTarget().wikiEditor('addToToolbar', {
			'section' : 'sztakipedias',
			'group' : 'suggestions',
			'tools' : {
				'infobox' : {
					label : 'Infobox', // FIXME use labelMsg for a localized label
					type : 'button',
					icon : 'http://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Application-default-icon.svg/22px-Application-default-icon.svg.png',
					//'http://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Taxobox_example.png/22px-Taxobox_example.png',
					//'http://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Gnome-insert-object.svg/22px-Gnome-insert-object.svg.png',
					action : {
						type : 'dialog',
						module : 'sztakipedia-toolbar-dialog-infobox'
					}
				}
			}
		});
	};			

	/**
	 * Initialize the toolbar for debugging tools.
	 * @private
	 */
	SztakipediaTB.initInfo = function() {

		// Add dialog
		var infoDialog = {
			'sztakipedia-toolbar-dialog-info' : {
				titleMsg : 'sztakipedia-dialog-info-title',
				id : 'sztakipediatoolbar-dialog-info',
				resizeme : false,
				init : function() {
				},
				html : '<div id="sztakipedia-dialog-info-loading">' + '<img src="http://upload.wikimedia.org/wikipedia/commons/4/42/Loading.gif" />' + '&nbsp;'
						+ mw.usability.getMsg('sztakipedia-loading') + '</div>',
				dialog : {
					width : 550,
					open : function() {
						SztakipediaTB.setupInfo();
					},
					buttons : {
						'wikieditor-toolbar-tool-link-cancel' : function() {
							$j(this).dialog('close');
						}
					}
				}
			}
		};
		SztakipediaTB.getTarget().wikiEditor('addDialog', infoDialog);

		// To add a group to an existing toolbar section:
		SztakipediaTB.getTarget().wikiEditor('addToToolbar', {
			'section' : 'sztakipedias',
			'groups' : {
				'debug' : {
					'label' : 'Debug' // FIXME use labelMsg for a localized label
		}
	}
		});
		// To add a button to an existing toolbar group:        
		SztakipediaTB.getTarget().wikiEditor('addToToolbar', {
			'section' : 'sztakipedias',
			'group' : 'debug',
			'tools' : {
				'info' : {
					label : 'Info', // FIXME use labelMsg for a localized label
					type : 'button',
					icon : 'http://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gtk-dialog-info.svg/22px-Gtk-dialog-info.svg.png',
					//					action : {
					//						type : 'callback',
					//						execute : function(context) {
					//							alert('remove');
					//							SztakipediaTB.target.wikiEditor('removeFromToolbar', {
					//								'section' : 'sztakipedias',
					//								'group' : 'suggestions',
					//								'tool' : 'book'
					//							});
					//						}
					//					},

					//					action : {
					//						type : 'encapsulate',
					//						options : {
					//							pre : "{{cite book}}" // text to be inserted
					//					}
					action : {
						type : 'dialog',
						module : 'sztakipedia-toolbar-dialog-info'
					}

				},
				'update' : {
					label : 'Update', // FIXME use labelMsg for a localized label
					type : 'button',
					icon : 'http://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Gnome-view-refresh.svg/22px-Gnome-view-refresh.svg.png',
					//					action : {
					//						type : 'callback',
					//						execute : function(context) {
					//							alert('remove');
					//							SztakipediaTB.target.wikiEditor('removeFromToolbar', {
					//								'section' : 'sztakipedias',
					//								'group' : 'suggestions',
					//								'tool' : 'book'
					//							});
					//						}
					//					},

					//					action : {
					//						type : 'encapsulate',
					//						options : {
					//							pre : "{{cite book}}" // text to be inserted
					//					}
					action : {
						type : 'callback',
						execute : function(context) {
							SztakipediaTB.updateRemoteContent(function() {
								alert("Done.");
							});
						}
					}
				}
			}
		});
	};

	/**
	 * Initialize Sztaki logo
	 * @private
	 */
	SztakipediaTB.initLogo = function() {

		// Add dialog
		var logoDialog = {
			'sztakipedia-toolbar-dialog-logo' : {
				titleMsg : 'sztakipedia-dialog-logo-title',
				id : 'sztakipediatoolbar-dialog-logo',
				resizeme : false,
				init : function() {
				},
				html : '<div id="sztakipediatoolbar-dialog-logo-content" class="sztakipedia-dialogs">' 
                                        + '<span> About sztakipedia </span>'
					+ '</div>',
				dialog : {
					width : 550,
					open : function() {
						SztakipediaTB.loadLinkSuggestions();
					},
					buttons : {
						'wikieditor-toolbar-tool-link-cancel' : function() {
							$j(this).dialog('close');
						}
					}
				}
			}
		};
		SztakipediaTB.getTarget().wikiEditor('addDialog', logoDialog);

		// To add a button to an existing toolbar group:        
		SztakipediaTB.getTarget().wikiEditor('addToToolbar', {
			'section' : 'sztakipedias',
			'group' : 'providedby',
			'tools' : {
				'logo' : {
					label : 'About Sztakipedia', // FIXME use labelMsg for a localized label
					type : 'button',
					icon : 'http://pedia.sztaki.hu/szp-images/logo-for-toolbar.png',
					action : {
						type : 'dialog',
						module : 'sztakipedia-toolbar-dialog-logo'
					}
				}
			}
		});
	};

	/**
	 * Initialize the toolbar. Adds a new toolbar section with tools, creates precomputable dialog windows.
	 * Shall be called only once.  
	 * @private
	 */
	SztakipediaTB.init = function() {

		//alert('init: ' + $j('div[rel=sztakipedias]')[0]);
		//		if (typeof $j('div[rel=sztakipedias]')[0] != 'undefined') { // Mystery IE bug workaround
		//			return;
		//		}
		$j('head').trigger('sztakipediatoolbarbase'); // allow callbacks
//		alert('init');
		
		importScriptURI( SztakipediaTB.getOption('basedir') + 'SztakipediaClient.js');
		

		var refsection = {
			sections : {
				sztakipedias : {
					type : 'toolbar',
					labelMsg : 'sztakipedia-section-label',
					groups : {
								'suggestions' : {
									'label' : 'Suggestions' // FIXME use labelMsg for a localized label
						},
								'providedby'  : {
									'label' : 'Provided by MTA SZTAKI' //FIXME use labelMsg
						}
					}						
				}
			}
		};
		if (!SztakipediaTB.getOption('modal')) {
			// $j('#sztakipedia-???').dialog('option', 'modal', false);
			appendCSS(".ui-widget-overlay {" + "display:none !important;" + "}");
		}
		SztakipediaTB.getTarget().wikiEditor('addToToolbar', refsection);
		
		
		
		// FIXME
		new sztakipediaTemplate('cite book', 'book', [ // Basic fields
		                                   			{
		                                   				"field" : "last",
		                                   				"autofillprop" : "last1"
		                                   			}, {
		                                   				"field" : "first",
		                                   				"autofillprop" : "first1"
		                                   			}, {
		                                   				"field" : "title",
		                                   				"autofillprop" : "title"
		                                   			}, {
		                                   				"field" : "year",
		                                   				"autofillprop" : "year"
		                                   			}, {
		                                   				"field" : "publisher",
		                                   				"autofillprop" : "publisher"
		                                   			}, {
		                                   				"field" : "location",
		                                   				"autofillprop" : "location"
		                                   			}, {
		                                   				"field" : "isbn",
		                                   				"autofillid" : "isbn"
		                                   			}, {
		                                   				"field" : "pages"
		                                   			}, {
		                                   				"field" : "url"
		                                   			}, {
		                                   				"field" : "author"
		                                   			}  ], [ // Expanded fields
		                                   			     {
		                                   				"field" : "edition",
		                                   				"autofillprop" : "edition"
		                                   			}, {
		                                   				"field" : "authorlink",
		                                   				"tooltip" : "sztakipedia-authorlink-tooltip"
		                                   			}, {
		                                   				"field" : "coauthors",
		                                   				"autofillprop" : "coauthors"
		                                   			}, {
		                                   				"field" : "editor"
		                                   			}, {
		                                   				"field" : "accessdate"
		                                   			}, {
		                                   				"field" : "archiveurl"
		                                   			}, {
		                                   				"field" : "archivedate"
		                                   			}, {
		                                   				"field" : "page"
		                                   			}, {
		                                   				"field" : "language"
		                                   			}, {
		                                   				"field" : "format"
		                                   			}, {
		                                   				"field" : "chapter"
		                                   			}, {
		                                   				"field" : "date"
		                                   			}, {
		                                   				"field" : "month"
		                                   			}, {
		                                   				"field" : "quote"
		                                   			} ]);

		//SztakipediaTB.Templates['cite-book'] = SztakipediaTB.Templates['book']; 
		var bookprediction = new sztakipediaTemplate('sztakipedia-bookprediction', 'bookprediction', [ // Basic fields
				{
					"field" : "title"
				}, {
					"field" : "author"
				}], [ // Expanded fields
				      	{
							"field" : "issued"
						}, {
							"field" : "description"							
						}, {
							"field" : "description"							
						}, {
							"field" : "identifier", 
							"tooltip" : 'sztakipedia-bookprediction-identifier-tooltip'
						} ]);
		bookprediction.refs = false;
		bookprediction.preview = false;
		
		var temlist = {};
		var d = new Date();
		var start = d.getTime();
		for ( var t in SztakipediaTB.Templates) {
			var tem = SztakipediaTB.Templates[t];
//			alert(t + "," + tem);
			var dialog = SztakipediaTB.toDialog(tem);
			var dialogid = dialog['titleMsg'];

			var actionobj = {
				'type' : 'dialog',
				'module' : dialogid
			};

			// FIXME HACK
			var messages = {};
			messages[dialogid] = tem.templatename;
			mw.usability.addMessages(messages);

			var dialogobj = {};
			dialogobj[dialogid] = dialog;
			SztakipediaTB.getTarget().wikiEditor('addDialog', dialogobj);
			if (!SztakipediaTB.getOption('modal')) {
				$j('#' + dialog['id']).dialog('option', 'modal', false);
			}
			temlist[SztakipediaTB.escStr(tem.shortform)] = {
				label : tem.templatename,
				action : actionobj
			};
		}

		// add suggestion tools
		SztakipediaTB.initLink();		
		SztakipediaTB.initCategory();		
		SztakipediaTB.initInfobox();
		SztakipediaTB.initBook();
		SztakipediaTB.initLogo();
		
		if (SztakipediaTB.getOption('debug')) {		
			SztakipediaTB.initInfo();
		}
	};

	/**
	 * Load local data - messages, cite templates, etc.
	 */
	$j(document).ready(function() {

		// TODO support more languages
		switch (wgUserLanguage) {
			// case 'de': // German
			// var RefToolbarMessages =
			// importScript('MediaWiki:RefToolbarMessages-de.js');
			// break;
			default: 
				// English
				// var RefToolbarMessages =
				// importScript('MediaWiki:RefToolbarMessages-en.js');
				var SztakipediaToolbarMessages = importScriptURI(SztakipediaTB.getOption('basedir') +'SztakipediaToolbarMessages-en.js');
		}
	});

  /**
   * Return a localized string for the key if present, or the key itself surrounded by braces if a localized string is missing.
   * @param {string} msgid The message key, e.g. 'sztakipedia-accept'.
   * @return {string} The localized string, or the encapsulated key.
   */
	SztakipediaTB.getMsgPlaceholder = function(msgid) {
		var msg = mw.usability.getMsg(msgid);
		if (typeof msg === 'undefined' || msg == null)
			msg = '{' + msgid + '}';
		
		return msg;
	};

	// REF FUNCTIONS
	/**
	 * Actually assemble a ref from user input
	 * @param {boolean} inneronly Omit &lt;ref&gt; tags.
	 * @param {boolean} forinsert
	 * @private
	 */
	SztakipediaTB.getRef = function(inneronly, forinsert) {
		
		// TODO on forinsert == true, cross-call CiteTB
		var template = SztakipediaTB.getOpenTemplate();
		var templatename = template.templatename;
		
		// disable <ref> for non-citation templates
		if (!template.refs)
			inneronly = true;
		
		var res = '';
		var refobj = {
			'shorttag' : false
		};
		if (!inneronly) {
			var group = $j('#sztakipedia-' + SztakipediaTB.escStr(template.shortform) + '-group').val();
			var refname = $j('#sztakipedia-' + SztakipediaTB.escStr(template.shortform) + '-name').val();
			res += '<ref';
			if (refname) {
				refname = $j.trim(refname);
				res += ' name="' + SztakipediaTB.getQuotedString(refname) +'"';
				refobj.refname = refname;
			}
			if (group) {
				group = $j.trim(group);
				res += ' group="' + SztakipediaTB.getQuotedString(group) + '"';
				refobj.refgroup = group;
			}
			res += '>';
		}
		var content = '{{' + templatename;
		for ( var i = 0; i < template.basic.length; i++) {
			var fieldname = template.basic[i].field;
			var field = $j('#sztakipedia-' + SztakipediaTB.escStr(template.shortform) + '-' + fieldname).val();
			if (field) {
				content += '|' + fieldname + '=';
				content += $j.trim(field.replace("|", "{{!}}"));
			}
		}
		if ($j('#sztakipedia-form-status').val() != 'closed') {
			for ( var i = 0; i < template.extra.length; i++) {
				var fieldname = template.extra[i].field;
				var field = $j('#sztakipedia-' + SztakipediaTB.escStr(template.shortform) + '-' + fieldname).val();
				if (field) {
					content += '|' + fieldname + '=';
					content += $j.trim(field.replace("|", "{{!}}"));
				}
			}
		}
		content += '}}';
		res += content;
		refobj.content = content;
		if (!inneronly) {
			res += '</ref>';
		}
		//alert('getRef: ' + res);
		return res;
	};


	/**
	 * Retrieve book suggestions. Also adds a book search form to the dialog window.
	 * @private
	 */
	SztakipediaTB.loadBookSuggestions = function() {
		// add search form if not already there
		$j('#sztakipediatoolbar-dialog-bookprediction-form:empty')
			.addClass('sztakipedia-search-form')
			.append($j('<span/>')
					.text(SztakipediaTB.getMsgPlaceholder('sztakipedia-bookprediction-form-title'))
					.addClass('sztakipedia-dialog-block-title'))
			.append($j('<div/>')
					.html(SztakipediaTB.Templates['sztakipedia-bookprediction'].getForm()
							.removeClass('sztakipedia-form-container'))
					.append($j('<input/>')
							.attr('type', 'checkbox')
							.attr('name', 'sztakipedia-bookprediction-token-checkbox')
							.attr('id', 'sztakipedia-bookprediction-token-checkbox')
							.addClass('sztakipedia-checkbox')
							.attr('checked','checked'))
					.append($j('<label/>')
							.attr('for', 'sztakipedia-bookprediction-token-checkbox')
							.addClass('sztakipedia-checkbox')	
							.text(SztakipediaTB.getMsgPlaceholder('sztakipedia-bookprediction-form-token-label')))
					)
			.after($j('<span/>')
					.text(SztakipediaTB.getMsgPlaceholder('sztakipedia-bookprediction-suggestions-title'))
					.addClass('sztakipedia-dialog-block-title'));

		SztakipediaTB.updateRemoteContent(function() {
			SztakipediaClient.buildDialogs(SztakipediaTB.setupBookSuggestions, SztakipediaTB.token, 'bookprediction');
		});
	};

	/**
	 * Retrieve internal link suggestions.
	 * @private
	 */
	SztakipediaTB.loadLinkSuggestions = function() {
		SztakipediaTB.updateRemoteContent(function() {
			SztakipediaClient.buildDialogs(SztakipediaTB.setupLinkSuggestions, SztakipediaTB.token, 'pagelinks');
		});
	};
	
	/**
	 * Retrieve category suggestions.
	 * @private
	 */
	SztakipediaTB.loadCategorySuggestions = function() {
		SztakipediaTB.updateRemoteContent(function() {
			SztakipediaClient.buildDialogs(SztakipediaTB.setupCategorySuggestions, SztakipediaTB.token, 'categoryprediction');
		});
	};
	
	/**
	 * Retrieve infobox suggestions.
	 * @private
	 */
	SztakipediaTB.loadInfoboxSuggestions = function() {
		SztakipediaTB.updateRemoteContent(function() {
			SztakipediaClient.buildDialogs(SztakipediaTB.setupInfoboxSuggestions, SztakipediaTB.token, 'infoboxprediction');
		});
	};
	
	/**
	 * Search for books based on the search form.
	 * @private
	 */
	SztakipediaTB.handleBookFormSubmit = function() {
		var template = SztakipediaTB.getOpenTemplate();
		var res = '';
		var params = {};
		
		for ( var i = 0; i < template.basic.length; i++) {
			var fieldname = template.basic[i].field;
			var field = $j('#sztakipedia-' + SztakipediaTB.escStr(template.shortform) + '-' + fieldname).val();
			if (field !== "")
				params[fieldname] = field;
		}
		if ($j('#sztakipedia-form-status').val() != 'closed') {
			for ( var i = 0; i < template.extra.length; i++) {
				var fieldname = template.extra[i].field;
				var field = $j('#sztakipedia-' + SztakipediaTB.escStr(template.shortform) + '-' + fieldname).val();
				if (field !== "")
					params[fieldname] = field;
			}
		}
		
		var includeToken = ($j('#sztakipedia-bookprediction-token-checkbox').attr('checked') === 'checked'); //  jQuery 1.4.x
		SztakipediaClient.buildDialogs(SztakipediaTB.setupBookSuggestions, 
				includeToken ? SztakipediaTB.token : undefined, 
				'bookprediction', 
				params);
		$j('#sztakipediatoolbar-dialog-bookprediction-content').attr('style', 'opacity:0.3;');
	};

	// ==============
	// AJAX FUNCTIONS
	// ==============
	
	/**
	 * Parse some wikitext and hand it off to a callback function.
	 * @param {string} text The wikitext fragment to be parsed.
	 * @param {function(string)} callback The function to be called with the resulting HTML.
	 * @requires MediaWiki-API
	 */
	SztakipediaTB.parse = function(text, callback) {
		//alert("wikitext: " + text);
		$j.post(wgServer + wgScriptPath + '/api.php', {
			action : 'parse',
			title : wgPageName,
			text : text,
			prop : 'text',
			format : 'json'
		}, function(data) {
			var html = data['parse']['text']['*'];
			callback(html);
		}, 'json');
	};

	/**
	 * Use the API to expand templates on some text
	 * @param {string} text The wikitext fragment to be expanded.
	 * @param {function(string)} callback The function to be called with the resulting HTML.
	 * @requires MediaWiki-API
	 * @private
	 */
	SztakipediaTB.expandtemplates = function(text, callback) {
		$j.post(wgServer + wgScriptPath + '/api.php', {
			action : 'expandtemplates',
			title : wgPageName,
			text : text,
			format : 'json'
		}, function(data) {
			var restext = data['expandtemplates']['*'];
			callback(restext);
		}, 'json');
	};

	/**
	 * Function to get the page text
	 * @param {function(string)} callback The function to be called with the resulting HTML.
	 * @requires MediaWiki-API
	 */
	SztakipediaTB.getPageText = function(callback) {
		var section = $j("input[name='wpSection']").val();
		if (section != '') {
			var postdata = {
				action : 'query',
				prop : 'revisions',
				rvprop : 'content',
				pageids : wgArticleId,
				format : 'json'
			};
			if (SztakipediaTB.getOption('expandtemplates')) {
				postdata['rvexpandtemplates'] = '1';
			}
			$j.get(wgServer + wgScriptPath + '/api.php', postdata, function(data) {
				var pagetext = data['query']['pages'][wgArticleId.toString()]['revisions'][0]['*'];
				callback(pagetext);
			}, 'json');
		}
		else {
			if (SztakipediaTB.getOption('expandtemplates')) {
				SztakipediaTB.expandtemplates($j('#wpTextbox1').wikiEditor('getContents').text(), callback);
			}
			else {
				callback($j('#wpTextbox1').wikiEditor('getContents').text());
			}
		}
	};

	/**
	 *  Autofill a template from an ID (ISBN, DOI, PMID)
	 */
	SztakipediaTB.initAutofill = function() {
		var elemid = $j(this).attr('id');
		var res = /^sztakipedia\-auto\-(.*?)\-(.*)\-(.*)$/.exec(elemid);
		var tem = res[1];
		var field = res[2];
		var autotype = res[3];
		var id = $j('#sztakipedia-' + tem + '-' + field).val();
		if (!id) {
			return false;
		}
		var url = 'http://toolserver.org/~alexz/ref/lookup.php?';
		url += autotype + '=' + encodeURIComponent(id);
		url += '&template=' + encodeURIComponent(tem);
		var s = document.createElement('script');
		s.setAttribute('src', url);
		s.setAttribute('type', 'text/javascript');
		document.getElementsByTagName('head')[0].appendChild(s);
		return false;
	};

	// FORM DIALOG FUNCTIONS
	// fill the accessdate param with the current date
	SztakipediaTB.fillAccessdate = function() {
		var elemid = $j(this).attr('id');
		var res = /^sztakipedia\-date\-(.*?)\-(.*)$/.exec(elemid);
		var id = res[1];
		var field = res[2];
		var DT = new Date();
		var datestr = SztakipediaTB.formatDate(DT);
		$j('#sztakipedia-' + id + '-' + field).val(datestr);
		return false;
	};

	SztakipediaTB.formatDate = function(DT) {
		var datestr = SztakipediaTB.getOption('date format');
		var zmonth = '';
		var month = DT.getUTCMonth() + 1;
		if (month < 10) {
			zmonth = "0" + month.toString();
		}
		else {
			zmonth = month.toString();
		}
		month = month.toString();
		var zdate = '';
		var date = DT.getUTCDate();
		if (date < 10) {
			zdate = "0" + date.toString();
		}
		else {
			zdate = date.toString();
		}
		date = date.toString();
		datestr = datestr.replace('<date>', date);
		datestr = datestr.replace('<month>', month);
		datestr = datestr.replace('<zdate>', zdate);
		datestr = datestr.replace('<zmonth>', zmonth);
		datestr = datestr.replace('<monthname>', SztakipediaTB.getOption('months')[DT.getUTCMonth()]);
		datestr = datestr.replace('<year>', DT.getUTCFullYear().toString());
		return datestr;
	};

	/**
	 * Callback function for parsed preview
	 * @param {string} parsed The HTML string.
	 */
	SztakipediaTB.fillNrefPreview = function(parsed) {
		$j('#sztakipedia-parsed-label').show();
		$j('#sztakipedia-namedref-parsed').html(parsed);
	};

	
	/**
	 * Callback function for parsed preview.
	 * @param {string} text The HTML fragment.
	 * 
	 */
	SztakipediaTB.fillTemplatePreview = function(text) {
		var template = SztakipediaTB.getOpenTemplate();
		var div = $j("#sztakipediatoolbar-" + SztakipediaTB.escStr(template.shortform));
		div.find('.sztakipedia-prev-parsed-label').show();
		div.find('.sztakipedia-preview-parsed').html(text);
		var container = div.find('.sztakipedia-form-container');
		var scrollTo = container.find('.sztakipedia-preview-parsed');
		SztakipediaTB.scrollTo(scrollTo, container, 'fast');		
	};

	/**
	 *  Click handler for template parsed preview
	 */
	SztakipediaTB.prevParseClick = function() {
		var template = SztakipediaTB.getOpenTemplate();
		var ref = SztakipediaTB.getRef(true, false);
		var div = $j("#sztakipediatoolbar-" + SztakipediaTB.escStr(template.shortform));
		div.find('.sztakipedia-prev-parse').hide();
		SztakipediaTB.parse(ref, SztakipediaTB.fillTemplatePreview);
	};

	/**
	 * Show/hide the extra fields in the dialog box
	 */
	SztakipediaTB.showHideExtra = function() {
		var template = SztakipediaTB.getOpenTemplate();
		var div = $j("#sztakipediatoolbar-" + SztakipediaTB.escStr(template.shortform));
		if (div.length == 0)
			div = $j("#sztakipediatoolbar-dialog-" + SztakipediaTB.escStr(template.shortform) + "-form");
			
		var setting = div.find(".sztakipedia-form-status").val();
		if (setting == 'closed') {
			div.find(".sztakipedia-form-status").val('open');
			div.find('.sztakipedia-extra-fields').show(1, function() {
				// jQuery adds "display:block", which screws things up
					div.find('.sztakipedia-extra-fields').attr('style', 'width:100%; background-color:transparent;');
				});
		}
		else {
			div.find(".sztakipedia-form-status").val('closed');
			div.find('.sztakipedia-extra-fields').hide();
		}
	};
	
	/**
	 * Select given character range in the text field.
	 * @param {number} start The first character position (inclusive).
	 * @param {number} end The last character position (exclusive).
	 * @param {Object} [field] The textarea to select text in.
	 */
	SztakipediaTB.selectRange = function(start, end, field) {
		//alert('Select [' + start +'-' + end + ']');
		if (typeof field == 'undefined')
			field = SztakipediaTB.getTarget().get(0);		
		
		if (end < start || start < 0)
			throw 'Invalid range [' + start +'-' + end + ']';
		
		 if (field.setSelectionRange) { // Modern browsers 
		    field.focus();
	        field.setSelectionRange(start, end);
		 } 
		 else if (field.createTextRange) { // IE (<9)

	        var newend = end - start;
	        var selRange = field.createTextRange();
	        selRange.collapse(true);
	        selRange.moveStart("character", start);
	        selRange.moveEnd("character", newend);
	        selRange.select();
		    field.focus();
	    } else {
	    	throw "Unrecognized browser!";
	    }

	};

	/**
	 * Resets form fields and previews.
	 * @private
	 */
	SztakipediaTB.resetForm = function() {
		var template = SztakipediaTB.getOpenTemplate();
		var id = SztakipediaTB.escStr(template.shortform);
		var div = $j("#sztakipediatoolbar-" + id);
		div.find('.sztakipedia-preview-label').hide();
		div.find('.sztakipedia-ref-preview').text('').hide();
		div.find('.sztakipedia-prev-parsed-label').hide();
		div.find('.sztakipedia-preview-parsed').html('');
		div.find('.sztakipedia-prev-parse').hide();
		$j('#sztakipedia-' + id + ' input[type=text]').val('');
	};

	/**
	 * Produce HTML for the link suggestions dialog.
	 * @param {Object} dialogs
	 */
	SztakipediaTB.setupLinkSuggestions = function(dialogs) {
		
		// FIXME some hacks to provide as-of-yet missing suggestion attributes
		for ( var dialogId in dialogs) {
			var dialog = dialogs[dialogId];
			for ( var suggestionId in dialog['suggestions']) {
				var suggestion = dialog['suggestions'][suggestionId];
				
				// FIXME hack to populate missing URL, remove after API provides URLs
				if (!('url' in suggestion)) {
					var capitaliseFirstLetter = function (string) {
					    return string.charAt(0).toUpperCase() + string.slice(1);
					};

					suggestion['url'] = 'http://en.wikipedia.org/wiki/' + capitaliseFirstLetter(suggestion['essence']);
					suggestion['meta'] = capitaliseFirstLetter(suggestion['essence']);
				}
				
				// FIXME hack to populate missing thumbnail, remove after API provides thumbnails
				if (!('thumbnail' in suggestion)) {
					suggestion['thumbnail'] = {
							'url' : 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No-Book.svg/80px-No-Book.svg.png',
							'width' : 80,
							'height' : 96 };
				}
			}
		}
		SztakipediaTB.setupDialogs(dialogs, 'link', 'sztakipediatoolbar-dialog-link-content');
		
	};
	
	/**
	 * Produce HTML for the category suggestions dialog.
	 * @param {Object} dialogs
	 */
	SztakipediaTB.setupCategorySuggestions = function(dialogs) {
		SztakipediaTB.setupDialogs(dialogs, 'category', 'sztakipediatoolbar-dialog-category');
	};
	
	/**
	 * Produce HTML for the infobox suggestions dialog.
	 * @param {Object} dialogs
	 */
	SztakipediaTB.setupInfoboxSuggestions = function(dialogs) {
		for ( var dialogId in dialogs) {
			for ( var suggestionId in dialogs[dialogId]['suggestions']) {
				var suggestion = dialogs[dialogId]['suggestions'][suggestionId];
				
				if ('html' in suggestion) {
					suggestion['template'] = SztakipediaTB.parseTemplateFromXhtml($j(SztakipediaClient.parseXML(suggestion['html'].replace(/<br\/>$/, "")))); // TODO hack to remove trailing <br> element
				}
			}
		}
		
		SztakipediaTB.setupDialogs(dialogs, 'infobox', 'sztakipediatoolbar-dialog-infobox-content');
	};
	
	/**
	 * Produce HTML for the book suggestions dialog.
	 * @param {Object} dialogs
	 */		
	SztakipediaTB.setupBookSuggestions = function(dialogs) {
		$j('#sztakipediatoolbar-dialog-bookprediction-content').attr('style', 'opacity:1;');		
		for ( var dialogId in dialogs) {
			for ( var suggestionId in dialogs[dialogId]['suggestions']) {
				var suggestion = dialogs[dialogId]['suggestions'][suggestionId];
				
				if ('html' in suggestion) {
					var template = SztakipediaTB.parseTemplateFromXhtml($j(SztakipediaClient.parseXML(suggestion['html'].replace(/<br\/>$/, "")))); // TODO hack to remove trailing <br> element
					var chunks = [];
					if ('author' in template['params'])
						chunks.push(template['params']['author']);
					if ('year' in template['params'])
						suggestion['meta'] += template['params']['year'];
					if ('isbn' in template['params'])
						suggestion['meta'] += template['params']['isbn'];
					suggestion['meta'] = chunks.join(', ');
					
					suggestion['template'] = template;
				}
			}
		}
		SztakipediaTB.setupDialogs(dialogs, 'bookprediction', 'sztakipediatoolbar-dialog-bookprediction-content');
	};
	
	/**
	 * Create HTML corresponding to a set of generic dialogs.
	 * 
	 * @param {Object} dialogs The list of dialogs.
	 * @param {string} sname The template's short name.
	 * @param {string} elementId The DOM element's id attribute to place the HTML in, and to register event listeners for.
	 */ 
	SztakipediaTB.setupDialogs = function(dialogs, sname, elementId) {
		var stuff = $j('<div />');
		var elem = $j('#' + elementId);
		if (elem.length != 1)
			throw 'Illegal number of matched elements (' + elem.length + ') for "#' + elementId +'"';
		elem.html(stuff);
		
		if (dialogs.length == 0) {
			// TODO also check number of suggestions, there may be 0
			stuff.text(SztakipediaTB.getMsgPlaceholder('sztakipedia-no-' + sname + '-suggestions'));
		}
		else {
			stuff.text(mw.usability.getMsg('sztakipedia-' + sname +'-suggestions-intro'));
			for ( var dialogId in dialogs) {
				var dialog = dialogs[dialogId];
				
				// API dialog block
				var block = $j('<div/>')
					.attr('id', 'sztakipedia-' + sname +'-dialog-' + dialogId )
					.addClass('sztakipedia-dialog-block');
			
				// Dialog intro, indirectly specified by key
				if ('introkey' in dialog) {
					block.append($j('<span/>')
						.addClass('sztakipedia-dialog-block-title')
						.text(SztakipediaTB.getMsgPlaceholder(dialog['introkey'])));
				} else if ('text' in dialog && SztakipediaTB.getOption('debug')) {
					block.append($j('<span/>')
							.addClass('sztakipedia-dialog-block-title').addClass('debug')
							.text(dialog['text']));
				}
				
				
				// build a list representing the dialog's suggestions
				var list = $j('<ul/>')
					.attr('id', 'sztakipedia-' + sname +'-dialog-' + dialogId + '-list')
					.addClass('sztakipedia-' + sname + '-suggestions-list');
				
				for ( var suggestionId in dialog['suggestions']) {
					//alert(suggestionId);
					var suggestion = dialog['suggestions'][suggestionId];

					var item = $j('<li/>')
						.attr('id', 'sztakipedia-' + sname +'-dialog-' + dialogId + '-suggestion-' + suggestionId)
						.addClass('sztakipedia-suggestion-container');
					
					var container = $j('<div/>')
						.addClass('sztakipedia-suggestion-text-container')
						.append($j('<span/>')
							.addClass('sztakipedia-suggestion-text')
							.text(suggestion['text']));

	
					if ('details' in suggestion) {
						var details = $j('<span/>')
							.addClass('sztakipedia-suggestion-details')
							.text(suggestion['details']);
						container.append(details);
					}

					if ('meta' in suggestion) {
						var url = $j('<span/>')
							.addClass('sztakipedia-suggestion-meta')
							.text(suggestion['meta']);
						container.append(url);
					}
					
					if ('contextsensitive' in suggestion['insertionstrategies'])
					{
						var cs = suggestion['insertionstrategies']['contextsensitive'];
						// due to CSS padding and background, <b/> is also "visible" when empty
						var snippet = $j('<span/>')
							.addClass('sztakipedia-suggestion-snippet')
							.append($j('<span/>').text('... ' + cs['before']))
							.append($j('<b/>').text(cs['replace']))
							.append($j('<span/>').text(cs['after'] + ' ...'));
						container.append(snippet);
					}
					
					if ('thumbnail' in suggestion) {
						var image = $j('<div/>').addClass('sztakipedia-suggestion-image-container');
						image.append($j('<img/>')
								.attr('id', 'sztakipedia-' + sname +'-dialog-' + dialogId + '-suggestion-' + suggestionId + '-thumbnail')
								.attr('src', suggestion['thumbnail']['url'])
//								.attr('width', suggestion['thumbnail']['width'])
//								.attr('height', suggestion['thumbnail']['height'])
								.addClass('sztakipedia-suggestion-thumbnail'));
						// TODO also insert source domain attribution below image (like Google search) for legal reasons
						item.append(image);
					}
					

					// TODO move accept/reject/preview action icons to CSS backgrounds 
					// Accept tool
					var actions = $j('<div/>').addClass('sztakipedia-suggestion-actions');
					var acceptlink = $j('<a href="#" />')
						.addClass('sztakipedia-suggestion-action')
						.attr('id', 'sztakipedia-' + sname +'-dialog-' + dialogId + '-suggestion-' + suggestionId + '-accept')
						.attr('title', mw.usability.getMsg('sztakipedia-accept'))
						.append($j('<img/>')
									.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/High-contrast-dialog-ok.svg/16px-High-contrast-dialog-ok.svg.png')
									.attr('alt', mw.usability.getMsg('sztakipedia-accept')))
						.append($j('<span/>')
							.addClass('sztakipedia-suggestion-action-title')
							.text(mw.usability.getMsg('sztakipedia-accept')));
					actions.append(acceptlink);

					// Reject tool
					var rejectlink = $j('<a href="#" />').addClass('sztakipedia-suggestion-action')
						.attr('id', 'sztakipedia-' + sname +'-dialog-' + dialogId + '-suggestion-' + suggestionId + '-reject')
						.attr('title', mw.usability.getMsg('sztakipedia-reject'))
						.append($j('<img/>')
							.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/High-contrast-dialog-close.svg/16px-High-contrast-dialog-close.svg.png')
							.attr('alt', mw.usability.getMsg('sztakipedia-reject')))
						.append($j('<span/>')
							.addClass('sztakipedia-suggestion-action-title')
							.text(mw.usability.getMsg('sztakipedia-reject')));
					actions.append(rejectlink);
					
					// Preview tool (optional)
					if ('url' in suggestion) {
						
						var previewlink = $j('<a/>')
							.addClass('sztakipedia-suggestion-action')
							.attr('id', 'sztakipedia-' + sname +'-dialog-' + dialogId + '-suggestion-' + suggestionId + '-preview')
							.attr('title', mw.usability.getMsg('sztakipedia-preview'))
							.attr('href', suggestion['url']).attr('target', '_blank')
							.append($j('<img/>')
								.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/High-contrast-system-search.svg/16px-High-contrast-system-search.svg.png')
								.attr('alt', mw.usability.getMsg('sztakipedia-preview')))
							.append($j('<span/>')
								.addClass('sztakipedia-suggestion-action-title')
								.text(mw.usability.getMsg('sztakipedia-preview')));
						actions.append(previewlink);						
					}
					
					container.append(actions);
					
					item.append(container);
					
					list.append(item);
				}
				
				stuff.after(block.append(list));
				
				// TODO insert links to 3rd party services involved for legal reasons
			}

			// attach accept/reject event listeners
			for (var dialogId in dialogs) {
				var dialog = dialogs[dialogId];
				for ( var suggestionId in dialog['suggestions']) {
					var suggestion = dialog['suggestions'][suggestionId];
					
					// Accept tool
					$j('#sztakipedia-' + sname +'-dialog-' + dialogId + '-suggestion-' + suggestionId + '-accept')
						.bind('click', (function(dId, sId) {
							return function() {
								var s = dialogs[dId]['suggestions'][sId];
//								alert('Accept "' + sId + '" ' + (typeof s));
							
								// Close modal dialog
								$j('#sztakipediatoolbar-dialog-' + sname).dialog('close');
								
								// Call API
								SztakipediaClient.answerDialog(function() {
									//alert('Answer processed.');
								}, SztakipediaTB.token, dialogs[dId]['builder'], dId, sId);
								
								if ('template' in s) {
									
									// FIXME wiki-normalize
									var templateTitle = s['template']['title'];
									var template = undefined;
									if (templateTitle in SztakipediaTB.Templates) {
										template = SztakipediaTB.Templates[templateTitle];
									} 
									else {
										if ('html' in s) {
											// create SztakipediaTemplate object
											template = SztakipediaTB.addTemplateFromXhtml($j(SztakipediaClient.parseXML(s['html'].replace(/<br\/>$/, "")))); // TODO hack to remove trailing <br> element
											template.refs = false;
											// create corresponding Wikieditor dialog
											var dialog = SztakipediaTB.toDialog(template);
											var dialogobj = {};
											dialogobj[dialog['titleMsg']] = dialog;
											SztakipediaTB.getTarget().wikiEditor('addDialog', dialogobj);
											
											// Provide tittle message
											var messages = {};
											messages[dialog['titleMsg']] = template.templatename;
											mw.usability.addMessages(messages);											
										} else {
											throw "Template dialog creation without HTML not implemented [template title: '" + s['template']['title'] +"']";
										}
									}
									var beginEnd = SztakipediaTB.searchByInsertionStragtegy(s['insertionstrategies']);
									SztakipediaTB.selectRange(beginEnd[0], beginEnd[1]);
									SztakipediaTB.getTarget().wikiEditor('openDialog', 'sztakipedia-dialog-' + template.shortform);
									SztakipediaTB.setTemplateDialogFields(template.shortform, s['template']['params']);
									
								}
								else {
									// Replace
									var beginEnd = SztakipediaTB.searchByInsertionStragtegy(s['insertionstrategies']);
									if (beginEnd == null)
										throw "No match!";
									SztakipediaTB.replaceRange(beginEnd[0], beginEnd[1], s['content']);
									
									// Highlight newly inserted replacement string
									SztakipediaTB.selectRange(beginEnd[0], parseInt(beginEnd[0])+s['content'].length);
								}
							};
						})(dialogId, suggestionId));
					
					// Reject tool
					$j('#sztakipedia-' + sname +'-dialog-' + dialogId + '-suggestion-' + suggestionId + '-reject')
						.bind('click', function() {
							//alert('Reject "' + suggestionId + '"');
							$j('#sztakipedia-' + sname +'-dialog-' + dialogId + '-suggestion-' + suggestionId).fadeOut(); // .slideUp();
						});
				}
			}
		}
	};

	/** 
	 * Function called to load client info
	 * Until the contents are loaded, its just a "Loading" placeholder for each section
	 */
	SztakipediaTB.setupInfo = function() {

		// initialize blocks
		var html = '';
		var blocks = [ 'sztakipedia-dialog-info-session', 'sztakipedia-dialog-info-dialogbuilders', 'sztakipedia-dialog-info-processors' ];
		for ( var i in blocks) {
			var id = blocks[i];
			html += '<div id="' + id + '-container" class="sztakipedia-dialog-block">' + '<span class="sztakipedia-dialog-block-title">'
					+ SztakipediaTB.getMsgPlaceholder(id + '-title') + '</span>' + '<div id="' + id + '">'
					+ '<img src="http://upload.wikimedia.org/wikipedia/commons/4/42/Loading.gif" />' + '&nbsp;' + mw.usability.getMsg('sztakipedia-loading')
					+ '</div>' + '</div>';
		}
		var sep = ':&nbsp;';
		//alert('setupInfo: ' + html);
		$j('#sztakipediatoolbar-dialog-info').html(html);

		// sync load session info
		{
			var stuff = $j('<div />');
			stuff.text(SztakipediaTB.getMsgPlaceholder('sztakipedia-info-session-intro'));
			var list = $j('<ul/>').attr('id', 'sztakipedia-info-session-list');
			var item;
			// session id
			item = $j('<li/>')
				.append($j('<span/>').addClass('sztakipedia-info-id').text('Session ID')) // FIXME add to messages.js
				.append(sep)
				.append($j('<span/>').text(SztakipediaClient.sessionid));
			list.append(item);

			// token
			item = $j('<li/>')
				.append($j('<span/>').addClass('sztakipedia-info-id').text('Token')) // FIXME add to messages.js
				.append(sep)
				.append($j('<span/>').text(SztakipediaTB.token));
			list.append(item);
		
			stuff.append(list);
			$j('#sztakipedia-dialog-info-session').html(stuff);
		}

		// async load block content
		SztakipediaClient.queryDialogBuilders(function(data) {
			var stuff = $j('<div />');
			stuff.text(SztakipediaTB.getMsgPlaceholder('sztakipedia-info-dialogbuilders-intro'));
				var list = $j('<ul/>').attr('id', 'sztakipedia-info-dialogbuilders-list');
				for ( var id in data) {
					var dialogbuilder = data[id];
					var item = $j('<li/>');
					item.attr('id', 'sztakipedia-info-dialogbuilder-' + id);
					item.append($j('<tt/>').addClass('sztakipedia-info-id').text(dialogbuilder['name']));
					item.append(sep);
					item.append($j('<span/>').text(dialogbuilder['description']));

					list.append(item);
				}
				stuff.append(list);
				$j('#sztakipedia-dialog-info-dialogbuilders').html(stuff);
			});

		// async load block content
		SztakipediaClient.queryProcessors(function(data) {
			var stuff = $j('<div />')
				.text(SztakipediaTB.getMsgPlaceholder('sztakipedia-info-processors-intro'));
			var list = $j('<ul/>').attr('id', 'sztakipedia-info-processors-list');
			for ( var id in data) {
				var processor = data[id];
				var item = $j('<li/>');
				item.attr('id', 'sztakipedia-info-processors-' + id);
				item.append($j('<tt/>').addClass('sztakipedia-info-id').text(processor['name']));
				item.append(sep);
				item.append($j('<span/>').text(processor['description']));

				list.append(item);
			}
			stuff.append(list);
			
			$j('#sztakipedia-dialog-info-processors').html(stuff);
		});
	};

	/**
	 * Send the text field contents to the API for analysis.
	 * @param {function()} callback The function to be called on completion.
	 */
	SztakipediaTB.updateRemoteContent = function(callback) {
		// make sure user is logged in
		if (typeof SztakipediaClient.sessionid == 'undefined') {
			SztakipediaClient.newSession(function(sessionid) {
				// TODO handle error (sessionid==undefined)
					SztakipediaTB.updateRemoteContent(callback); // recurse
				}, (SztakipediaTB.getOption('anonymous') ? '' : wgUser));
			return;
		}

		// make sure a token is requested
		if (typeof SztakipediaTB.token == 'undefined') {
			SztakipediaClient.newToken(function(token) {
				// TODO handle error (token==undefined)
					SztakipediaTB.token = token;
					SztakipediaTB.updateRemoteContent(callback); // recurse
				});
			return;
		}

		// TODO hack to call all processors
		SztakipediaClient.update(function(data) { // TODO check for errors
//					SztakipediaClient.buildList(function() {
//						SztakipediaClient.buildList(function() {
							//SztakipediaClient.buildDialogs(function() {
								callback();
							//}, SztakipediaTB.token, 'pagelinks');
//						}, SztakipediaTB.token, 'internallinks');
//					}, SztakipediaTB.token, 'tokenizer');
				}, SztakipediaTB.token, SztakipediaTB.getTarget().val() + '');
	};

	// ========================
	// STRING UTILITY FUNCTIONS
	// ========================
	
	/**
	 *  Returns a string quoted as necessary for name/group attributes
	 */
	SztakipediaTB.getQuotedString = function(s) {
		var sp = /\s/.test(s); // spaces
		var sq = /\'/.test(s); // single quotes
		var dq = /\"/.test(s); // double quotes
		if (!sp && !sq && !dq) { // No quotes necessary
			return s;
		}
		else if (!dq) { // Can use double quotes
			return '"' + s + '"';
		}
		else if (!sq) { // Can use single quotes
			return "'" + s + "'";
		}
		else { // Has double and single quotes
			s = s.replace(/\"/g, '\"');
			return '"' + s + '"';
		}
	};
	// Fix up strings for output - capitalize first char, replace underscores
	// with spaces, squeeze sequences of spaces, remove leading and trailing space
	// a.k.a. wikify
	SztakipediaTB.fixStr = function(s) {
		s = s.slice(0, 1).toUpperCase() + s.slice(1);
		s = s.replace(/[_ ]+/g, ' ');
		s = s.replace(/^ | $/g, '');
		return s;
	};

	/**
	 *  Escape spaces and quotes for use in HTML ids or CSS classes
	 */
	SztakipediaTB.escStr = function(s) {
		return s.replace(' ', '-').replace(/[^a-zA-Z0-9_-]+/g, '_');
	};

	/**
	 *  Escape regular expression special characters to be used in regexp as literal characters.
	 */
	SztakipediaTB.escapeRegex = function(text) {
	    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	
	// MISC FUNCTIONS
	/**
	 *  Determine which template form is open, and get the template object for it.
	 */
	SztakipediaTB.getOpenTemplate = function() {
		var dialogs = $j(".ui-dialog-content.ui-widget-content:visible");
		var templatename = $j(dialogs[0]).find(".sztakipedia-template").val();
		var template = null;
		return SztakipediaTB.Templates[templatename];
	};
	
	/** 
	 * Replace a text range (e.g., after accepting a suggestion).
	 */
	SztakipediaTB.replaceRange = function(start, end, replacement) {
		if (end < start || start < 0)
			throw "Invalid range.";
		
		var text = SztakipediaTB.getTarget().val();
		if (end > text.length)
			throw "Out of bounds.";
		text = text.slice(0,start) + replacement + text.slice(end);
		SztakipediaTB.getTarget().val(text);
		SztakipediaTB.getTarget().change(); // to make sure a 'change' event is triggered (for Opera)
	};

	/**
	 * Find the text span to be replaced in the target text field given a set of insertion strategies.
	 * @param {Object} insertionstrategies
	 * @param {string} [text] the string to search, defaults to the textarea contents
	 * @return Array A two-element array containing the start and end character positions.
	 */
	SztakipediaTB.searchByInsertionStragtegy = function(insertionstrategies, text) {
		if (typeof text == 'undefined')
			text = SztakipediaTB.getTarget().val() + '';
		var start = -1;
		var end = -1;
		if ('sourceposition' in insertionstrategies) {
			var cs = insertionstrategies['sourceposition'];
			start = cs['begin'];
                        end = cs['end'];
		} else if ('contextsensitive' in insertionstrategies) {
			var cs = insertionstrategies['contextsensitive'];
			var re = new RegExp('(' + SztakipediaTB.escapeRegex(cs['before']) +')(' + SztakipediaTB.escapeRegex(cs['replace']) + ')(' + SztakipediaTB.escapeRegex(cs['after']) +')', "");
			var groups = re.exec(text);
			if (groups == null)
				throw "No match!";
			start = groups.index + groups[1].length;
			end = start + groups[2].length;
		} else if ('characterpositionbased' in insertionstrategies) {
			var cs = insertionstrategies['characterpositionbased'];
			start = cs['begin'];
			end = cs['end'];
		} else if ('absolute' in insertionstrategies) {
			var cs = insertionstrategies['absolute'];
			if (cs['where'] === 'end') {
				start = text.length;
				end = start;
			} else if (cs['where'] === 'begin') {
				start = 0;
				end = 0;
			} else {
				throw "Unrecognized absolute position: " + cs['where'];
			}
		} else {
			throw "No supported insertion policy found among " + insertionstrategies.length + ' (e.g., ' + insertionstrategies[0] +')';
		}
		// TODO implement other strategies too
		if (start < 0)
			return null;
		
		return [start, end];
	};


	/**
	 * Creates a RefToolbar-style template descriptor from a Sztakipedia XHTML DOM template element.
	 * @return {Object} The resulting {@link sztakipediTemplate} object.
	 */
	// TODO move as much as possible to SztakipediaClient
	SztakipediaTB.addTemplateFromXhtml = function(template) {

		var title = template.find('.wiki-template-title').text();

		var basicFields = [];
		var expandedFields = [];
		template.find('.wiki-template-param').each(function(index) {
			var param = $j(this);
			var key = param.find('.wiki-template-param-key').text();
			var value = param.find('.wiki-template-param-value').text();
			var help = param.find('.wiki-template-param-help').text();
			var example = param.find('.wiki-template-param-example').text();
			var hidden = param.hasClass('hidden');

			var field = {
				'field' : key
			};
			field['tooltip'] = help;

			if (hidden)
				expandedFields.push(field);
			else
				basicFields.push(field);
		});
		return new sztakipediaTemplate(title, SztakipediaTB.escStr(title), basicFields, expandedFields);
//		SztakipediaTB.init(); // FIXME hack, init() should not be called again
	};
	
	/**
	 * Parse template title and parameters from a Sztakipedia XHTML DOM element into an object.
	 * @param  {jQuery} template The DOM element corresponding to the template.  
	 * @return Object
	 */
	 // TODO move to SztakipediaClient 
	SztakipediaTB.parseTemplateFromXhtml = function(template) {
		
		//alert(typeof template + template);
		
		var res = {
				'type' : 'template', 
				'params' : {},
				'title' : undefined,
				'multiline' : false
				};
		res['title'] = template.find('.wiki-template-title').text();

		template.find('.wiki-template-param').each(function(index) {
			var param = $j(this);
			var key = param.find('.wiki-template-param-key').text();
			var value = param.find('.wiki-template-param-value').text();

			res['params'][key] = value;
		});
		return res;
	};
	

	SztakipediaTB.setTemplateDialogFields = function(sform, values) {
		var dialog = $j('#sztakipediatoolbar-' + sform);
		for ( var field in values) {
			
			var fieldid = 'sztakipedia-' + sform + '-' + field; // FIXME CiteToolbar could get away with this, but field names may contain spaces unsuitable for XHTML ids
			if (dialog.find('#' + fieldid).val(values[field]).length == 0)
				throw "could not find field '" + fieldid +"'";
			//alert("Setting " + field + " of " + dialog.find('#' + fieldid).attr("class") + " to " + values[field]);
		}
	};

	/**
	 * Scroll to specific item.
	 * 
	 * @param {jQuery} scrollTo The element to show.
	 * @param {jQuery} container The ancestor element having a scrollbar.
	 * @param {string} [speed] Animation speed 'fast' or 'slow'. Omit for no animation.
	 * @see http://stackoverflow.com/questions/2905867/how-to-scroll-to-specific-item-using-jquery
	 */
	SztakipediaTB.scrollTo = function(scrollTo, container, speed) {
		var scrollHeight = container.scrollTop() + scrollTo.offset().top - container.offset().top;
		if (typeof speed === 'undefined')
			container.scrollTop(scrollHeight);
		else
			container.animate({scrollTop : scrollHeight}, speed);
	};
	

} // End of code loaded only on edit
