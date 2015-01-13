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
    
    var BottomDisplay = require('BottomDisplayPanal'),
        BottomDisplayVar;

    function main(){
        var editor = EditorManager.getFocusedEditor();
        var text   = editor.document.getText();
        var result = parser(text);

        //console.log(editor.document.getLanguage()._name);
        if(editor && editor.document.getLanguage()._name === 'HTML'){
            if(result.length > 0){
                MarkErrors.markErrors(result[3] - 1, result[4] - 1, result[1], result[2]);
                console.log("Error Found");
                console.log("Start of Error Line : " + result[3] + " Character : " + result[1] + " End of Error Line : " + result[4] + " Character : " + result[2]);
                console.log("The strings between are:\n" + result[5]);
                BottomDisplayVar.update(result[0]);
            }else{
                MarkErrors.clearErrors();
                console.log("No Errors Found");
                BottomDisplayVar.update(text);
            }
            
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
    
    function showpan() {
        console.log("Showing Panel");
        BottomDisplayVar.panelRender(true);
    }
    
    function hidepan() {
        console.log("Hiding Panel");
        BottomDisplayVar.panelRender(false);
    }
    
    function run_checker() {
        console.log("Run checker");
        BottomDisplayVar.update("Hello this is the temp error while I make this work");
    }
    
    
    
    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "Show_Slowparse_Panel"; // package-style naming to avoid collisions
    CommandManager.register("Show_Slowparse_Panel", MY_COMMAND_ID, showpan);
    var MY_COMMAND_ID2 = "Hide_SlowParse_Panel";
    CommandManager.register("Hide_Slowparse_Panel", MY_COMMAND_ID2, hidepan); 
    var MY_COMMAND_ID3 = "Run_Checker";
    CommandManager.register("Run_Checker", MY_COMMAND_ID3, main);
    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-U");
    menu.addMenuItem(MY_COMMAND_ID2, "Ctrl-Alt-Y");
    menu.addMenuItem(MY_COMMAND_ID3, "Ctrl-Alt-T");
    
    AppInit.appReady(function(){
        BottomDisplayVar = new BottomDisplay();
        var currentEditor = EditorManager.getCurrentFullEditor();
        var CurrentDoc = DocumentManager.getCurrentDocument();
        $(currentEditor).on('keyEvent', keyEventHandler);
        $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});