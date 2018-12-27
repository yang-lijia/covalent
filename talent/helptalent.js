/**
 * Created by john_tng on 25/7/18.
 */

const Tools = require('../modules/tools');

/**
 * A class to handle the general help command.
 */
class HelpTalent {

    /**
     * Class constructor to set some base variables
     * @param commandManager - The object to manage bots commands.
     * @param commandProcessor - The class to process the commands and parameters.
     */
    constructor(commandManager, commandProcessor) {

        HelpTalent.commandManager = commandManager;
        HelpTalent.commandProcessor = commandProcessor;

        // Add bot commands.
        this.init();
    }

    /**
     * Initialise the commands.
     */
    init() {

        HelpTalent.commandManager.add(
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
    displayhelp(ctx) {

        let help = '';

        let command = HelpTalent.commandProcessor.process(ctx);
        if (command.numberOfParams === 0) {
            // display simple help if no parameter.
            help = HelpTalent.commandManager.getAllHelp();

        } else {

            // display simple help if no parameter.
            help = HelpTalent.commandManager.getDetailHelp(command.param1);
        }

        Tools.replyHTML(ctx, help);
    }
}

module.exports = HelpTalent;