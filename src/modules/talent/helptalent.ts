/**
 * Created by john_tng on 25/7/18.
 */
import { ContextMessageUpdate, Context } from 'telegraf';

import { CommandManager, CommandProcessor } from '../command';
import Tools from '../tools';

/**
 * A class to handle the general help command.
 */
export default class HelpTalent {

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
            'help',
            'Display basic help.',
            '/help [command]\n- Display more detail help. 👍',
            this.displayhelp);
    }

    /**
     * Display help for the users.
     * This function will be smart enough to display different help to users and super users.
     * @param ctx - Telegram bot context.
     */
    displayhelp(ctx:ContextMessageUpdate) {

        let help = '';

        let command = this.commandProcessor.process(ctx);
        if (command.numberOfParams === 0) {
            // display simple help if no parameter.
            help = this.commandManager.getAllHelp();
        } else {
            // display simple help if no parameter.
            help = this.commandManager.getDetailHelp(command.param1);
        }

        Tools.replyHTML(ctx, help);
    }
}
