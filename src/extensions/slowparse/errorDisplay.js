/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, CodeMirror, brackets, less, $, XMLHttpRequest, document */

define(function (require, exports, module) {
    "use strict";

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

       
        //console.log("Finished markErrors");
    }

    //Function that clears all the underlined lines
    function clearErrors(){
        var editor = EditorManager.getFocusedEditor();

        var cmDoc = editor._codeMirror.getAllMarks();
        console.log(cmDoc);

        if(cmDoc.length > 0){

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
            var $lineNumberBoxForError = $("<span class='cc-JSLint-warning'/>");
            var $errorMarkerInLineGutter = $("<span/>");
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
});