import {ContextMessageUpdate, Markup} from 'telegraf';
import {getRepository} from 'typeorm';
import {Chatgroup} from '../../entity/Chatgroup';

import { CommandManager, CommandProcessor } from '../command';
import Tools from '../tools';

export default class SurveyTalent {

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
            'addsurvey',
            'Add a survey',
            'Add a survey',
            this.addSurvey.bind(this));
    }

    /**
     * Add a survey for a particular chat group
     * @param ctx - Telegram bot context.
     */
    addSurvey(ctx: ContextMessageUpdate) {
        Tools.replyInlineKeyboard(ctx, 'Please name your survey:', {});
    }

}
