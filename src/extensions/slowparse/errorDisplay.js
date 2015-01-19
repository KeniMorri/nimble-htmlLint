/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, less, $, document */

define(function (require, exports, module) {
	"use strict";
	
	var EditorManager = brackets.getModule("editor/EditorManager"),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		widgetsErrors = [],
		gutters = [];
		ExtensionUtils.loadStyleSheet(module, "main.less");
	
	//Function that highlights the line(s) with errors
	function markErrors(lineStart, lineEnd, charStart, charEnd) {
		var editor   = EditorManager.getFocusedEditor();
		var allMarks = editor._codeMirror.getAllMarks();

<<<<<<< HEAD
    var EditorManager   = brackets.getModule("editor/EditorManager"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        widgetsErrors   = [],
        gutters         = [];

    ExtensionUtils.loadStyleSheet(module, "main.less");
    //ExtensionUtils.loadStyleSheet(module, "slowparse.css");

    //Function that underlines the given lines
    function markErrors(lineStart, lineEnd, charStart, charEnd) {
        var editor = EditorManager.getFocusedEditor();

        var cmDoc = editor._codeMirror.getAllMarks();
        //console.log(cmDoc);

        if(!cmDoc.length){
             var marked = editor._codeMirror.markText({line: lineStart, ch: charStart},
            {line: lineEnd, ch: charEnd}, {className: "underline"});
         }
=======
		if(!allMarks.length){
			editor._codeMirror.markText({line: lineStart, ch: charStart},
				{line: lineEnd, ch: charEnd},
				{ className: "errorHighlight"});
		}
	}
	
	//Function that clears all the highlighted lines
	function clearErrors(){
		var editor   = EditorManager.getFocusedEditor();
		var allMarks = editor._codeMirror.getAllMarks();

		if(allMarks.length > 0){
			allMarks.forEach(function(element){
				element.clear();
			});
		}
	}
	
	//Function that creates a widget under the line where the error
	//is located and displays the error message.
	function showWidget(errorText, lineStart){
		var editor    = EditorManager.getFocusedEditor();
		var allMarks  = editor._codeMirror.getAllMarks();
		var lineStats = editor._codeMirror.lineInfo(lineStart);

		if(!lineStats.widgets && widgetsErrors.length === 0){
			//Creating a node
			var htmlNode =document.createElement("p");
			var text = document.createTextNode(errorText);
			htmlNode.appendChild(text);

			var errrorWidget = editor._codeMirror.addLineWidget(lineStart, htmlNode,
				{coverGutter: false, noHScroll: false, above: false, showIfHidden: false});
			
			widgetsErrors.push(errrorWidget);
		}
	}
>>>>>>> 2b92cc32fd63f054c5ab1ebf6cb0ab05908092a3

	//Function that removes the line widget (errors)
	function removeWidget(){
		//Remove displayed error messages
		widgetsErrors.forEach(function (lineWidget, lineIndex, array) {
			if (lineWidget) {
				lineWidget.clear();
			}
		});
		widgetsErrors = [];
	}

	//Function that adds a button on the gutter (on given line nubmer) next to the line numbers
	function showGutter(lineStart){
		if(gutters.length === 0){
			var editor = EditorManager.getFocusedEditor();
			var $errorDiv = $("<div class='error'/>");
			var $errorMarker = $("<span class='errorButton'/>");
			var foundGutters = ["errorButton"];

			$errorDiv.append($errorMarker);
			$errorMarker.addClass("errorText");
			$errorMarker.text("!");

			gutters.push(editor._codeMirror.setGutterMarker(lineStart, "errorButton", $errorDiv[0]));

<<<<<<< HEAD
            cmDoc.forEach(function(element){
                element.clear();
            });
        }

        //var widgets = editor._codeMirror.getWidgets();
        //console.log(widgets);
        //console.log("Clear Underline");
    }

    //Function that creates a widget under the line where the error
    //is located and displays the error message.
    function showWidget(errorText, lineStart){
        var editor = EditorManager.getFocusedEditor();

        var cmDoc = editor._codeMirror.getAllMarks();
        //console.log(cmDoc);
        var lineStats = editor._codeMirror.lineInfo(lineStart);
        //console.log(lineStats.widgets);


        if(!lineStats.widgets && widgetsErrors.length === 0){

            // create a node
            var htmlNode =document.createElement("p");
          
            var text =  document.createTextNode(errorText);
            htmlNode.appendChild(text);

            var errrorWidget = editor._codeMirror.addLineWidget(lineStart, htmlNode,
                {coverGutter: false, noHScroll: false, above: false, showIfHidden: false});

            widgetsErrors.push(errrorWidget);

            //console.log(errrorWidget);
         }

    }

    function removeWidget(){
        // remove displayed error messages
        widgetsErrors.forEach(function (lineWidget, lineIndex, array) {
            if (lineWidget) {
                lineWidget.clear();
            }
        });
        widgetsErrors = [];
    }

    //Function that adds a button on the gutter next to the line numbers
    function showGutter(lineStart){
        if(gutters.length === 0){
            var editor = EditorManager.getFocusedEditor();
            //var $random = $("<div class='interactive-linter-gutter'>!</div>");
            var $lineNumberBoxForError = $("<span class='cc-JSLint-warning'/>" + "<DIV TITLE='header=[First row]'>");
            var $errorMarkerInLineGutter = $("</DIV><span/>");
            $errorMarkerInLineGutter.addClass("cc-JSLint-syntax-error");
            $lineNumberBoxForError.append($errorMarkerInLineGutter);
            $errorMarkerInLineGutter.addClass("cc-JSLint-one-error");
            $lineNumberBoxForError.attr("title", 0);
            $errorMarkerInLineGutter.text("!");
            gutters.push(editor._codeMirror.setGutterMarker(lineStart, "cc-JSLint-syntax-error", $lineNumberBoxForError[0]));
            //gutters.push(editor._codeMirror.setGutterMarker(lineStart, "CodeMirror-linenumbers", $random[0]));
            console.log(gutters[0]);
            //var foundGutters = ["cc-JSLint-warning"];
            var foundGutters = editor._codeMirror.getOption("gutters").slice(0);
            if(foundGutters.indexOf("cc-JSLint-syntax-error") === -1){
                foundGutters.unshift("cc-JSLint-syntax-error");
            }
            console.log(foundGutters);
            editor._codeMirror.setOption("gutters", foundGutters);
        }

    }

    //Function that removes gutter button
    function removeGutter(){
        var editor = EditorManager.getFocusedEditor();
        gutters = [];
        editor._codeMirror.clearGutter("cc-JSLint-syntax-error");
    }

    exports.markErrors   = markErrors;
    exports.clearErrors  = clearErrors;
    exports.showWidget   = showWidget;
    exports.showGutter   = showGutter;
    exports.removeGutter = removeGutter;
    exports.removeWidget = removeWidget;
=======
			editor._codeMirror.setOption("gutters", foundGutters);
		}
	}

	//Function that removes gutter button
	function removeGutter(){
		var editor = EditorManager.getFocusedEditor();
		gutters = [];
		editor._codeMirror.clearGutter("errorButton");
	}
	
	exports.markErrors = markErrors;
	exports.clearErrors = clearErrors;
	exports.showWidget = showWidget;
	exports.showGutter = showGutter;
	exports.removeGutter = removeGutter;
	exports.removeWidget = removeWidget;
>>>>>>> 2b92cc32fd63f054c5ab1ebf6cb0ab05908092a3
});