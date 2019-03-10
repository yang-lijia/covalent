import { ContextMessageUpdate, Markup } from 'telegraf';
import { getRepository } from 'typeorm';
import { Chatgroup } from '../../entity/Chatgroup';
import { CommandManager, CommandProcessor } from '../command';
import { Reply } from '../tools';
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
            'register',
            'Register your group with Covalent',
            'Register your group with Covalent',
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

        const isGroup = response.type === 'group' || response.type === 'supergroup';

        if (isGroup) {
            const group = new Chatgroup();
            group.chatgroupId = response.id;
            group.name = response.title;
            try {
                await getRepository(Chatgroup).save(group);
            } catch (exception) {
                if (exception.message.indexOf('UNIQUE constraint failed') !== -1) {
                    ctx.reply( Reply.removeTemplateLiteralIndents`Sorry, this chat group has already been registered! You can:
                        view admins with /viewadmins
                        change admins with /changeadmins
                        unregister with /unregister`);
                }
                return;
            }
            ctx.reply('Congrats! Registration is successful. Please proceed to add administrator with /addAdministrator.');
        } else {
            ctx.reply('Oh no, find your buddies & have fun together. :) ');
        }
    }

    async unregister(ctx: ContextMessageUpdate) {
        const response = await ctx.getChat();
        if (response.type === 'group' || response.type === 'supergroup') {
            try {
                const chatgroupRepo = await getRepository(Chatgroup);
                const chatgroup = await chatgroupRepo.findOne({
                    chatgroupId: response.id,
                });
                // To do: Confirmation to delete before we delete?
                // To do: Need to remove all admins and feedback also?
                await chatgroupRepo.remove(chatgroup);
                ctx.reply('This group has been successfully unregistered!');
            } catch (exception) {
                ctx.reply('Sorry, something went wrong while trying to unregister this chat!');
            }
        }
    }


}
