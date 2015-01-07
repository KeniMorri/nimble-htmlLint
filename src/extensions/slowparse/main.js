define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus"),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        WorkspaceManager = brackets.getModule("view/WorkspaceManager");

    var parse = require("slowparse/slowparse");    

    // Function to run when the menu item is clicked
    function parser() {
        var editor = EditorManager.getFocusedEditor();
        var text   = editor.document.getText();
        var result = parse.HTML(document, text);
        console.log(result.error);
        
        if(result.error){
            var obj = result.error;
            console.log(obj.type);
            console.log(obj.start);
            console.log(obj.end);
        }
    }

    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "slowparse"; // package-style naming to avoid collisions
    CommandManager.register("Show Slowparse Panel", MY_COMMAND_ID, parser);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID);

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});