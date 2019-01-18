import { ContextMessageUpdate, Markup } from 'telegraf';
import { getRepository } from 'typeorm';
import { Administrator } from '../../entity/Administrator';
import { Chatgroup } from '../../entity/Chatgroup';

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
        this.commandManager.add(
            'addsurvey',
            'Add a survey',
            'Add a survey',
            this.addSurvey.bind(this),
        );
    }

    /**
     * Add a survey for a particular chat group
     * @param ctx - Telegram bot context.
     */
    async addSurvey(ctx: ContextMessageUpdate) {
        const adminRepository = getRepository(Administrator);
        const chatgroupRepository = getRepository(Chatgroup);

        // Check if is group, and that invoker is admin of chatgroup
        if (ctx.chat.type === 'group') {
            const admin = await adminRepository
                .createQueryBuilder('administrator')
                .leftJoinAndSelect('administrator.chatgroups', 'chatgroup', 'chatgroup.chatgroupId = :chatgroupId', {
                    chatgroupId: ctx.chat.id,
                })
                .where('administrator.userId = :userId', { userId: ctx.from.id })
                .getOne();

            if (admin && admin.chatgroups.length > 0) {
                // Button list of available, default surveys, 3 in total

            } else {
                ctx.reply('Sorry, you are not a survey admin of this chat group!');
            }
        }
        // Support custom surveys?
    }
}
