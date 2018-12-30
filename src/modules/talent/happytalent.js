"use strict";
exports.__esModule = true;
var tools_1 = require("../tools");
var Markup = require('telegraf/markup');
/**
 * A class to handle the general help command.
 */
var HappyTalent = /** @class */ (function () {
    /**
     * Class constructor to set some base variables
     * @param commandManager - The object to manage bots commands.
     * @param commandProcessor - The class to process the commands and parameters.
     */
    function HappyTalent(commandManager, commandProcessor) {
        this.commandManager = commandManager;
        this.commandProcessor = commandProcessor;
        // Add bot commands.
        this.init();
    }
    /**
     * Initialise the commands.
     */
    HappyTalent.prototype.init = function () {
        this.commandManager.add('happybo', 'Check happiness level', 'Check happiness level', this.checkHappiness);
    };
    /**
     * Display survey question for user
     * @param ctx - Telegram bot context.
     */
    HappyTalent.prototype.checkHappiness = function (ctx) {
        //Todo: shouldn't be a command but rather a cronjob to display question
        tools_1["default"].replyInlineKeyboard(ctx, 'Your happiness at work is...', [
            Markup.callbackButton('😶 Normal', 0),
            Markup.callbackButton('🙂 Happy', 1),
            Markup.callbackButton('😄 Very Happy', 2),
            Markup.callbackButton('😂 Siao liao', 3)
        ]);
    };
    return HappyTalent;
}());
exports["default"] = HappyTalent;
