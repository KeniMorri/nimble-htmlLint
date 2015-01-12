define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus"),
        AppInit = brackets.getModule('utils/AppInit'),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        WorkspaceManager = brackets.getModule("view/WorkspaceManager");

    var parser = require("parser");   

    function main(){
        var editor = EditorManager.getFocusedEditor();
        var text   = editor.document.getText();
        var result = parser(text);
        
        
        //TEMP CODE FOR KLEVER
        //Line counter code
        var endCount = 0;
        var linebegin = 0;
        var text2;
        for(var i = 0; i <= (result[2] - 1); i++)
        {
            if(text[i] == "\n")
            {
                endCount += 1;
                linebegin = i;
            }
            text2 += text[i];
        }
        //window.alert("EndLine Equals: " + endCount +"\n Line Begin was: " + linebegin + "\n result was: " + result[1] + "\n" + text2);
        console.log("EndLine Equals: " + endCount +"\n Line Begin was: " + linebegin + "\n result was: " + result[1] + "\n" + text2);
        console.log("Charater at Result was: " + text2[result[1]] + " " + text2[result[2]]);
        console.log("Character at linebegin was: " + text2[linebegin]);
        console.log(text2[196] + text2[197] + text2[198] + text2[199] + text2[200] + text2[201] + text2[202] + text2[203] + text2[204]);
        //END TEMP CODE
        
        
        
        
    }
    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "slowparse"; // package-style naming to avoid collisions
    CommandManager.register("Show Slowparse Panel", MY_COMMAND_ID, main);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID);

    AppInit.appReady(function()
                     {


                        //window.alert("Init");


    });

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});