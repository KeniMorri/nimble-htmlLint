/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, less, $, document */

define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        AppInit             = brackets.getModule('utils/AppInit'),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        BottomDisplay       = require('BottomDisplayPanal'),
        MarkErrors          = require("errorDisplay"),
        parser              = require("parser"),
        results             = [],
        showingErrors       = false,
        lastErrorIndex      = -1,
        BottomDisplayVar;   
    
    function main(){
        var editor = EditorManager.getFocusedEditor();

        if(editor && editor.document.getLanguage()._name === 'HTML'){
            var text   = editor.document.getText();
            var result = parser(text);
            
            if(result.length > 0){
                results.push(result);
                if(lastErrorIndex !== -1 && lastErrorIndex !== (result[3] - 1)){
                    clearAllErrors();
                }
                MarkErrors.showGutter(result[3] - 1);
                MarkErrors.markErrors(result[3] - 1, result[4] - 1, result[1], result[2]);
                lastErrorIndex = (result[3] - 1);
            }else{
                clearAllErrors();
            }
            BottomDisplayVar.update(text);
            //BottomDisplayVar.update(result[0]);
        }
        return result;
    }

    //Function that clears all errors
    var clearAllErrors = function(){
        MarkErrors.clearErrors();
        MarkErrors.removeGutter();
        MarkErrors.removeWidget();
        results = [];
    }

    var toggleErrors = function(editor, line, gutter, event){
        if(results.length > 0 && !showingErrors && line === results[0][3] - 1){
            results.forEach(function (result) {
                MarkErrors.showWidget(result[0], result[3] - 1);
                showingErrors = true;     
            });
        }else if(results.length > 0 && showingErrors && line === results[0][3] - 1){
            MarkErrors.removeWidget();
            showingErrors = false;
        }else{
            main();
        }
    }

    //Keyboard event handler
    var keyEventHandler = function ($event, editor, event) {
        if (event.type === "keyup") {
            main();

        }
    };


    //Switching editors
    var activeEditorChangeHandler = function ($event, focusedEditor, lostEditor) {
        var editor = EditorManager.getFocusedEditor();
        if (lostEditor) {
            $(lostEditor).off("keyup", keyEventHandler);
            lostEditor._codeMirror.off("gutterClick", toggleErrors);
        }

        if (focusedEditor) {
            $(focusedEditor).on("keyup", keyEventHandler);
            focusedEditor._codeMirror.on("gutterClick", toggleErrors);
        }

    };
    
    //Function that shows panel
    function showpan() {
        BottomDisplayVar.panelRender(true);
    }
    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "Show_Slowparse_Panel"; // package-style naming to avoid collisions
    CommandManager.register("Show Parsed HTML Panel", MY_COMMAND_ID, showpan);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID,  "Ctrl-Alt-U");
    
    AppInit.appReady(function(){
        BottomDisplayVar = new BottomDisplay();
        var currentEditor = EditorManager.getCurrentFullEditor();
        $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });
});