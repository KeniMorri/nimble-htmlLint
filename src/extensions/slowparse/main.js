define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        AppInit             = brackets.getModule('utils/AppInit'),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        WorkspaceManager    = brackets.getModule("view/WorkspaceManager"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        Document            = brackets.getModule("document/Document"),
        MarkErrors          = require("errorDisplay"),
        parser              = require("parser"),
        results             = [],
        showingErrors       = false,
        lastErrorIndex      = -1;   
    
    var BottomDisplay = require('BottomDisplayPanal'),
        BottomDisplayVar;

    function main(){
        var editor = EditorManager.getFocusedEditor();

        //console.log(editor.document.getLanguage()._name);
        if(editor && editor.document.getLanguage()._name === 'HTML'){
            var text   = editor.document.getText();
            var result = parser(text);
            
            if(result.length > 0){
                results.push(result);
                console.log("Error found at: " + (result[3] - 1));
                console.log("Last Error Index: " + lastErrorIndex);
                if(lastErrorIndex !== -1 && lastErrorIndex !== (result[3] - 1)){
                    /*MarkErrors.clearErrors();
                    MarkErrors.removeGutter();
                    MarkErrors.removeWidget();
                    results = [];*/
                    clearAllErrors();
                }
                MarkErrors.showGutter(result[3] - 1);
                MarkErrors.markErrors(result[3] - 1, result[4] - 1, result[1], result[2]);
                //console.log($(EditorManager).on("gutterClick", toggleErrors(result)));
                lastErrorIndex = (result[3] - 1);
                console.log("Error Found");
                //console.log("Start of Error Line : " + result[3] + " Character : " + result[1] + " End of Error Line : " + result[4] + " Character : " + result[2]);
                //console.log("The strings between are:\n" + result[5]);
                //MarkErrors.showWidget(result[0], result[3] - 1);
                

            }else{
                /*MarkErrors.clearErrors();
                MarkErrors.removeGutter();
                MarkErrors.removeWidget();
                //console.log($(EditorManager).off("gutterClick", toggleErrors(result)));
                console.log("No Errors Found");
                results = [];*/
                clearAllErrors();
            }
            BottomDisplayVar.update(result[0]);
        }
        return result;
    }

    var clearAllErrors = function(){
        MarkErrors.clearErrors();
        MarkErrors.removeGutter();
        MarkErrors.removeWidget();
        //console.log($(EditorManager).off("gutterClick", toggleErrors(result)));
        console.log("No Errors Found");
        results = [];
    }

    var toggleErrors = function(editor, line, gutter, event){
        if(line === 2){
            console.log("Clicked on line 3");
        }

        //console.log(results[0][3] - 1);
        //console.log(line);

        if(results.length > 0 && !showingErrors && line === results[0][3] - 1){
            results.forEach(function (result) {
                //MarkErrors.markErrors(result[3] - 1, result[4] - 1, result[1], result[2]);
                MarkErrors.showWidget(result[0], result[3] - 1);
                console.log("Showing Errors");
                showingErrors = true;     
            });
        }else if(results.length > 0 && showingErrors && line === results[0][3] - 1){
            MarkErrors.removeWidget();
            //MarkErrors.clearErrors();
            showingErrors = false;
            console.log("Not Showing Errors");
        }else{
            main();
        }
        console.log("In toggleErrors");

    }

    //Keyboard event handler
    var keyEventHandler = function ($event, editor, event) {

        if (event.type === "keyup") {
            //console.log("Key pressed!");
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

            //console.log("focused editor exists!");

            focusedEditor._codeMirror.on("gutterClick", toggleErrors);
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
        //BottomDisplayVar.update("Hello this is the temp error while I make this work");
        main();
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
    menu.addMenuItem(MY_COMMAND_ID,  "Ctrl-Alt-U");
    menu.addMenuItem(MY_COMMAND_ID2, "Ctrl-Alt-Y");
    menu.addMenuItem(MY_COMMAND_ID3, "Ctrl-Alt-T");
    
    AppInit.appReady(function(){
        BottomDisplayVar = new BottomDisplay();
        var currentEditor = EditorManager.getCurrentFullEditor();
        $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });
});