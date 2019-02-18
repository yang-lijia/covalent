import { ContextMessageUpdate, Markup } from 'telegraf';

import { CommandManager, CommandProcessor } from '../command';
import { Reply } from '../tools';

/**
 * A class to handle the general help command.
 */
export default class HappyTalent {

    private commandManager: CommandManager;
    private commandProcessor: CommandProcessor;

    /**
     * Class constructor to set some base variables
     * @param commandManager - The object to manage bots commands.
     * @param commandProcessor - The class to process the commands and parameters.
     */
    constructor(commandManager: CommandManager, commandProcessor: CommandProcessor) {

        this.commandManager = commandManager;
        this.commandProcessor = commandProcessor;

        // Add bot commands.
        this.init();
    }

    /**
     * Initialise the commands.
     */
    init() {
        this.commandManager.add(
            'happybo',
            'Check happiness level',
            'Check happiness level',
            this.checkHappiness.bind(this),
        );
    }

    /**
     * Display survey question for user
     * @param ctx - Telegram bot context.
     */
    checkHappiness(ctx: ContextMessageUpdate) {
        // Todo: shouldn't be a command but rather a cronjob to display question
        Reply.replyInlineKeyboard(ctx, 'Your happiness at work is...', [
            Markup.callbackButton('😶 Normal', '0'),
            Markup.callbackButton('🙂 Happy', '1'),
            Markup.callbackButton('😄 Very Happy', '2'),
            Markup.callbackButton('😂 Siao liao', '3'),
        ]);
    }
}
