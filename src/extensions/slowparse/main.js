define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        AppInit             = brackets.getModule('utils/AppInit'),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        WorkspaceManager    = brackets.getModule("view/WorkspaceManager"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        MarkErrors          = require("errorDisplay"),
        parser              = require("parser");   

    function main(){
        var editor = EditorManager.getFocusedEditor();
        var text   = editor.document.getText();
        var result = parser(text);

        //console.log(editor.document.getLanguage()._name);

        if(editor && editor.document.getLanguage()._name === 'HTML'){

            if(result.length > 0){

                MarkErrors.markErrors(result[3] - 1, result[3] - 1, 0, 20);
                console.log("Error Found");

            }else{
                MarkErrors.clearErrors();
                console.log("No Errors Found");
            }
            console.log("The Error Happens Between : " + result[1] + "-" + result[2]);
            var output;
            for(var i = result[1]; i <= result[2];i++)
            {
                output += text[i];
            }
            console.log("The strings between are:\n" + output);
            console.log("Line Count: ", result[3]);
        }
    }

    //Keyboard event handler
    var keyEventHandler = function ($event, editor, event) {
        if ((event.type === "keyup")) {
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
        var currentEditor = EditorManager.getCurrentFullEditor(),
            CurrentDoc    = DocumentManager.getCurrentDocument();
 
            $(currentEditor).on('keyEvent', keyEventHandler);
            $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});