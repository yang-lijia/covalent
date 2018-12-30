"use strict";
exports.__esModule = true;
var tools_1 = require("../tools");
/**
 * A class to handle the general help command.
 */
var HelpTalent = /** @class */ (function () {
    /**
     * Class constructor to set some base variables
     * @param commandManager - The object to manage bots commands.
     * @param commandProcessor - The class to process the commands and parameters.
     */
    function HelpTalent(commandManager, commandProcessor) {
        this.commandManager = commandManager;
        this.commandProcessor = commandProcessor;
        // Add bot commands.
        this.init();
    }
    /**
     * Initialise the commands.
     */
    HelpTalent.prototype.init = function () {
        this.commandManager.add('help', 'Display basic help.', '/help [command]\n- Display more detail help. 👍', this.displayhelp);
    };
    /**
     * Display help for the users.
     * This function will be smart enough to display different help to users and super users.
     * @param ctx - Telegram bot context.
     */
    HelpTalent.prototype.displayhelp = function (ctx) {
        var help = '';
        var command = this.commandProcessor.process(ctx);
        if (command.numberOfParams === 0) {
            // display simple help if no parameter.
            help = this.commandManager.getAllHelp();
        }
        else {
            // display simple help if no parameter.
            help = this.commandManager.getDetailHelp(command.param1);
        }
        tools_1["default"].replyHTML(ctx, help);
    };
    return HelpTalent;
}());
exports["default"] = HelpTalent;
