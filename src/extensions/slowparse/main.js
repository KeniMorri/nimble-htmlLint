define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        AppInit             = brackets.getModule('utils/AppInit'),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        WorkspaceManager    = brackets.getModule("view/WorkspaceManager"),
        MarkErrors          = require("errorDisplay"),
        parser              = require("parser");   

    function main(){
        var editor = EditorManager.getFocusedEditor();
        var text   = editor.document.getText();
        var result = parser(text);

        if(result.length > 0){
            MarkErrors.markErrors(1, 1, result[2], result[3]);
            console.log("Error Found");
            console.log("Start of Error Line : " + result[3] + " Character : " + result[1] + " End of Error Line : " + result[4] + " Character : " + result[2]);
        	console.log("The strings between are:\n" + result[5]);
        }
        else{
            MarkErrors.clearErrors();
            console.log("No Errors Found");
        }
    }

     //Keyboard event handler
    var keyEventHandler = function ($event, editor, event) {
        if ((event.type === "keyup") /*&& (event.keyCode === 9)*/) {
            //console.log("Key pressed!");
            main();
        }
    };

    //Switching editors
    var activeEditorChangeHandler = function ($event, focusedEditor, lostEditor) {
        if (lostEditor) {
            $(lostEditor).off("keyup", keyEventHandler);
        }

        if (focusedEditor) {
            $(focusedEditor).on("keyup", keyEventHandler);
        }
    };

    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "slowparse"; // package-style naming to avoid collisions
    CommandManager.register("Show Slowparse Panel", MY_COMMAND_ID, main);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID);

    AppInit.appReady(function(){
        var currentEditor = EditorManager.getCurrentFullEditor();
        $(currentEditor).on('keyEvent', keyEventHandler);
        $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});