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
        this.init();
    }

    /**
     * Initialise the commands.
     */
    init() {
        this.commandManager.add(
            'start',
            'Start using Covalent',
            'Start using Covalent',
            this.register.bind(this),
        );
    }

    /**
     * Register a group
     * @param ctx - Telegram bot context.
     */
    async register(ctx: ContextMessageUpdate) {
        let response = await ctx.getChat();

        const isGroup = response.type === 'group';

        if (isGroup) {
            const group = new Chatgroup();
            group.chatgroupId = response.id;
            group.name = response.title;
            try {
                await getRepository(Chatgroup).save(group);

            } catch (Exception) {
                 console.log(Exception);
            }

            let administrators = await ctx.getChatAdministrators();
            let buttons = [];
            for (let i = 0; i < administrators.length; i++) {
                buttons.push(Markup.callbackButton(administrators[i].user.first_name, administrators[i].user.id.toString()));
            }
            ActiveSession.startSession('addAdministrator', response.id);

            Tools.replyInlineKeyboard(ctx, 'Welcome on board! Who shall be the administrator for this group?', buttons);

        } else {
            Tools.replyHTML(ctx, 'Oh no, find your buddies & have fun together. :) ');
        }

    }
}
