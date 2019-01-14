import { ContextMessageUpdate, Markup } from 'telegraf';
import { getRepository } from 'typeorm';
import { Chatgroup } from '../../entity/Chatgroup';
import ActiveSession from '../activeSession';

import { CommandManager, CommandProcessor } from '../command';
import Tools from '../tools';

/**
 * A class to handle the general help command.
 */
export default class RegisterTalent {

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
            'start',
            'Start using Covalent',
            'Start using Covalent',
            this.register.bind(this),
        );
        this.commandManager.add(
            'unregister',
            'Unregister this chat group from covalent',
            'Unregister this chat group from covalent',
            this.unregister.bind(this),
        );
    }

    /**
     * Register a group
     * @param ctx - Telegram bot context.
     */
    async register(ctx: ContextMessageUpdate) {
        const response = await ctx.getChat();

        const isGroup = response.type === 'group';

        if (isGroup) {
            const group = new Chatgroup();
            group.chatgroupId = response.id;
            group.name = response.title;
            try {
                await getRepository(Chatgroup).save(group);
            } catch (exception) {
                if (exception.message.indexOf('UNIQUE constraint failed') !== -1) {
                    ctx.reply(Tools.removeTemplateLiteralIndents`Sorry, this chat group has already been registered! You can:
                        view admins with /viewadmins
                        change admins with /changeadmins
                        unregister with /unregister`);
                }
                return;
            }

            const buttons = [];
            const administrators = await ctx.getChatAdministrators();

            // We want 4 buttons per row for admin
            // There will always be at least 1 admin, hence totalBins >= 1.
            let totalBins = Math.ceil(administrators.length / 4);
            while (totalBins > 0) {
                buttons.push([]);
                totalBins--;
            } // Buttons is now [[], [], ...], containing [] equal to no of bins.
            for (let i = 0; i < administrators.length; i++) {
                const admin = administrators[i];
                const bin = Math.floor(i / 4);
                buttons[bin].push(Markup.callbackButton(admin.user.first_name, admin.user.id.toString()));
            }
            ActiveSession.startSession('addAdministrator', group.chatgroupId);

            Tools.replyInlineKeyboard(ctx, 'Welcome on board! Who shall be the administrator for this group?', buttons);
        } else {
            ctx.reply('Oh no, find your buddies & have fun together. :) ');
        }
    }

    async unregister(ctx: ContextMessageUpdate) {
        const response = await ctx.getChat();
        if (response.type === 'group') {
            try {
                const chatgroupRepo = await getRepository(Chatgroup);
                const chatgroup = await chatgroupRepo.findOne({
                    chatgroupId: response.id,
                });
                // Need to remove all admins and feedback also?
                await chatgroupRepo.remove(chatgroup);
                ctx.reply('This group has been successfully unregistered!');
            } catch (exception) {
                ctx.reply('Sorry, something went wrong while trying to unregister this chat!');
            }
        }
    }
}
