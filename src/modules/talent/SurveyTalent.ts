import { ContextMessageUpdate, Markup } from 'telegraf';
import { getRepository } from 'typeorm';
import { Survey } from '../../entity/Survey';
import { CommandManager, CommandProcessor } from '../command';
import { Access, Reply } from '../tools';

export default class SurveyTalent {
    private commandManager: CommandManager;
    private commandProcessor: CommandProcessor;

    /**
     * Class constructor to set some base variables
     * @param commandManager - The object to manage bots commands.
     * @param commandProcessor - The class to process the commands and parameters.
     */
    constructor(
        commandManager: CommandManager,
        commandProcessor: CommandProcessor,
    ) {
        this.commandManager = commandManager;
        this.commandProcessor = commandProcessor;

        // Add bot commands.
        this.commandManager.add(
            'addsurvey',
            'Add a survey',
            'Add a survey',
            this.addSurvey.bind(this),
        );

        this.commandManager.add(
            'deletesurvey',
            'Delete a survey',
            'Delete a survey',
            this.deleteSurvey.bind(this),
        );

        this.commandManager.add(
            'listsurvey',
            'List surveys',
            'List surveys',
            this.listSurvey.bind(this),
        );
    }

    /**
     * List Surveys for a particular chat group
     * @param ctx - Telegram bot context.
     */
    async listSurvey(ctx: ContextMessageUpdate) {
        if (ctx.chat.type === 'group') {
            if (await Access.isAdmin(ctx)) {
                const surveyRepository = await getRepository(Survey);
                // TODO to form query to retrieve surveys based on group id
            } else {
                ctx.reply(
                    'Sorry, you are not a survey admin of this chat group!',
                );
            }
        } else {
            ctx.reply('Sorry, you are not inside a chatgroup!');
        }
    }

    /**
     * Delete a survey for a particular chat group
     * @param ctx - Telegram bot context.
     */
    async deleteSurvey(ctx: ContextMessageUpdate) {
        // Check if is group, and that invoker is admin of chatgroup
        if (ctx.chat.type === 'group') {
            if (await Access.isAdmin(ctx)) {
                // Delete a survey
            } else {
                ctx.reply(
                    'Sorry, you are not a survey admin of this chat group!',
                );
            }
        } else {
            ctx.reply('Sorry, you are not inside a chatgroup!');
        }
    }

    /**
     * Add a survey for a particular chat group
     * @param ctx - Telegram bot context.
     */
    async addSurvey(ctx: ContextMessageUpdate) {
        ctx.reply('Cleanse');
        // Check if is group, and that invoker is admin of chatgroup
        if (ctx.chat.type === 'group') {
            if (await Access.isAdmin(ctx)) {
                // Button list of available, default surveys, 3 in total
            } else {
                ctx.reply(
                    'Sorry, you are not a survey admin of this chat group!',
                );
            }
        } else {
            ctx.reply('Sorry, you are not inside a chatgroup!');
        }
        // Support custom surveys?
    }
}
