/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, CodeMirror, brackets, less, $, XMLHttpRequest, document */

/** Simple extension that adds a "File > Hello World" menu item. Inserts "Hello, world!" at cursor pos. */
define(function (require, exports, module) {
    "use strict";

    var CommandManager  = brackets.getModule("command/CommandManager"),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        ChangedDocument = brackets.getModule("document/ChangedDocumentTracker"),
        CodeMirror      = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils");

    ExtensionUtils.loadStyleSheet(module, "main.less");

    //var editor = EditorManager.getFocusedEditor();

    //var markOptionsForNormalErrorHighlight  = {className: "cc-JSLint-error-highlight"};

    // Function to run when the menu item is clicked
    function markErrors(line, start, end) {
        var editor = EditorManager.getFocusedEditor();

        var marked = editor._codeMirror.markText({line: line, ch: start}, {line: line, ch: end}, {className: "cc-JSLint-error-highlight"});
        //marked.clear();
        console.log("Finished markErrors");
    }

    function clearErrors(){
        var editor = EditorManager.getFocusedEditor();

        var cmDoc = editor._codeMirror.getAllMarks();
        console.log(cmDoc);

        if(cmDoc.length > 0){

            cmDoc.forEach(function(element){
                element.clear();
            });
        }
        
        console.log("Clear Underline");

    }

    exports.markErrors  = markErrors;
    exports.clearErrors = clearErrors;
});