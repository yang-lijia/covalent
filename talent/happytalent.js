/**
 * Created by john_tng on 25/7/18.
 */

const Tools = require('../modules/tools');
const Markup = require('telegraf/markup');

/**
 * A class to handle the general help command.
 */
class HappyTalent {

    /**
     * Class constructor to set some base variables
     * @param commandManager - The object to manage bots commands.
     * @param commandProcessor - The class to process the commands and parameters.
     */
    constructor(commandManager, commandProcessor) {

        HappyTalent.commandManager = commandManager;
        HappyTalent.commandProcessor = commandProcessor;

        // Add bot commands.
        this.init();
    }

    /**
     * Initialise the commands.
     */
    init() {

        HappyTalent.commandManager.add(
            'happybo',
            'Check happiness level',
            'Check happiness level',
            this.checkHappiness);
    }

    /**
     * Display survey question for user
     * @param ctx - Telegram bot context.
     */
    checkHappiness(ctx) {

        //Todo: shouldn't be a command but rather a cronjob to display question

        Tools.replyInlineKeyboard(ctx, 'Your happiness at work is...', [
            Markup.callbackButton('😶 Normal', 0),
            Markup.callbackButton('🙂 Happy', 1),
            Markup.callbackButton('😄 Very Happy', 2),
            Markup.callbackButton('😂 Siao liao', 3)
        ]);



    }
}

module.exports = HappyTalent;