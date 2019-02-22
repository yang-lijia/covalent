import { ContextMessageUpdate, Markup } from 'telegraf';
import { getRepository } from 'typeorm';
import { Chatgroup } from '../../entity/Chatgroup';
import { Administrator } from '../../entity/Administrator';
import ActiveSession from '../activeSession';

import { CommandManager, CommandProcessor } from '../command';
import { Reply } from '../tools';

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
        this.commandManager.add(
            'addAdministrator',
            'Add administrator to manage covalent',
            'Add administrator to manage covalent',
            this.showChatAdministrator.bind(this),
        );
        this.commandManager.add(
            'deleteAdministrator',
            'Delete administrator; remove his/her rights to manage covalent',
            'Delete administrator; remove his/her rights to manage covalent',
            this.showExistingAdministrator.bind(this),
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

            await this.showChatAdministrator(ctx);


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
                // To do: Confirmation to delete before we delete?
                // To do: Need to remove all admins and feedback also?
                await chatgroupRepo.remove(chatgroup);
                ctx.reply('This group has been successfully unregistered!');
            } catch (exception) {
                ctx.reply('Sorry, something went wrong while trying to unregister this chat!');
            }
        }
    }

    async showChatAdministrator(ctx: ContextMessageUpdate){

        const response = await ctx.getChat();

        const buttons = [];
        const chatAdministrators = await ctx.getChatAdministrators();

        const adminRepository = await getRepository(Administrator);
        const currentAdmins = await adminRepository
            .createQueryBuilder('administrator')
            .select('administrator.userId')
            .leftJoin('administrator.chatgroups', 'chatgroup', 'chatgroup.chatgroupId = :chatgroupId', {
                chatgroupId: response.id,
            })
            .getMany();

        let newAdmins = chatAdministrators.filter(chatAdministrator => !currentAdmins.find(currentAdmin => currentAdmin.userId === chatAdministrator.user.id));

        // We want 4 buttons per row for admin
        // There will always be at least 1 admin, hence totalBins >= 1.
        let totalBins = Math.ceil(newAdmins.length / 4);
        while (totalBins > 0) {
            buttons.push([]);
            totalBins--;
        } // Buttons is now [[], [], ...], containing [] equal to no of bins.
        for (let i = 0; i < newAdmins.length; i++) {
            const admin = newAdmins[i];
            const bin = Math.floor(i / 4);
            buttons[bin].push(Markup.callbackButton(admin.user.first_name, admin.user.id.toString()));
        }
        if(newAdmins.length > 0) {
            buttons.push([]);
            buttons[buttons.length - 1].push(Markup.callbackButton('Exit!', 'exit'));

            let message = ctx.update.message;

            ActiveSession.startSession('addAdministrator', response.id, message);

            Reply.replyInlineKeyboard(ctx, 'Who shall be the administrator for this group?', buttons);
        }else{
            Reply.replyHTML(ctx, "All chat administrators are added as Administrators.");
        }

    }

    async addAdministrator(ctx: ContextMessageUpdate){

        //check if is exit; kill session
        //else we add administrator
        let callbackQuery = ctx.update.callback_query;
        let chatgroupId = callbackQuery.message.chat.id;

        if(callbackQuery.data === 'exit'){
            ctx.answerCbQuery('Ok! Ready for next command!');
            ctx.editMessageText('Done with adding administrators!'); //remove the button
            ActiveSession.endSession(chatgroupId);

        }else{
            let userId = parseInt(callbackQuery.data);
            const chatgroupRepo = await getRepository(Chatgroup);
            const chatgroup = await chatgroupRepo.findOne({
                chatgroupId: chatgroupId
            });

            const administratorRepo = await getRepository(Administrator);
            const administrator = await administratorRepo.findOne({
                userId: userId
            });

            if(administrator){
                let found = administrator.chatgroups.find( function( group ) {
                    return group.chatgroupId === chatgroupId;
                } );
                if(found){
                    ctx.answerCbQuery('User is already an administrator for this group.');
                }else{
                    administrator.chatgroups.push(chatgroup);
                    await getRepository(Administrator).save(administrator);
                }
            }else{
                const newAdministrator = new Administrator();
                newAdministrator.userId = userId;
                newAdministrator.chatgroups = [];
                newAdministrator.chatgroups.push(chatgroup);
                await getRepository(Administrator).save(newAdministrator);
                ctx.answerCbQuery('Successfully added!');
            }

        }

    }

    async showExistingAdministrator(ctx: ContextMessageUpdate){

        const response = await ctx.getChat();

        const buttons = [];

        const adminRepository = await getRepository(Administrator);
        const currentAdmins = await adminRepository
            .createQueryBuilder('administrator')
            .select('administrator.userId')
            .leftJoin('administrator.chatgroups', 'chatgroup', 'chatgroup.chatgroupId = :chatgroupId', {
                chatgroupId: response.id,
            })
            .getMany();

        // We want 4 buttons per row for admin
        // There will always be at least 1 admin, hence totalBins >= 1.
        let totalBins = Math.ceil(currentAdmins.length / 4);
        while (totalBins > 0) {
            buttons.push([]);
            totalBins--;
        } // Buttons is now [[], [], ...], containing [] equal to no of bins.

        for (let i = 0; i < currentAdmins.length; i++) {
            const admin = await ctx.getChatMember(currentAdmins[i].userId);
            const bin = Math.floor(i / 4);
            buttons[bin].push(Markup.callbackButton(admin.user.first_name, admin.user.id.toString()));
        }

        if(currentAdmins.length > 0) {
            buttons.push([]);
            buttons[buttons.length - 1].push(Markup.callbackButton('Exit!', 'exit'));

            let message = ctx.update.message;

            ActiveSession.startSession('deleteAdministrator', response.id, message);

            Reply.replyInlineKeyboard(ctx, 'Delete user as administrator?', buttons);
        }else{
            Reply.replyHTML(ctx, "There are no administrator for this chat.");
        }
    }

    async deleteAdministrator(ctx: ContextMessageUpdate, isCallback){

        //check if is exit; kill session
        //else we delete administrator
        let chatgroupId = isCallback ? ctx.update.callback_query.message.chat.id : ctx.update.message.chat.id;

        if(isCallback && ctx.update.callback_query.data === 'exit'){
                ctx.answerCbQuery('Ok! Ready for next command!');
                ctx.editMessageText('Done with deleting administrators!'); //remove the button
                ActiveSession.endSession(chatgroupId);


        }else{
            let userId = isCallback ? parseInt(ctx.update.callback_query.data) : ctx.update.message.left_chat_member.id;

            const administratorRepo = await getRepository(Administrator);
            const administrator = await administratorRepo
                .createQueryBuilder('administrator')
                .leftJoinAndSelect('administrator.chatgroups', 'chatgroup')
                .where('administrator.userId = :userId', {userId: userId})
                .getOne();

            if (administrator && administrator.chatgroups.length > 0) {
                if (administrator.chatgroups.length === 1) {
                    await administratorRepo
                        .createQueryBuilder()
                        .delete()
                        .from(Administrator)
                        .where("id = :id", {id: administrator.id})
                        .execute();
                } else {
                    let index = administrator.chatgroups.findIndex(chatgroup => chatgroup.chatgroupId === chatgroupId);
                    if (index != -1) {
                        administrator.chatgroups.splice(index, 1);
                        await getRepository(Administrator).save(administrator);
                    }
                }
                if(isCallback) {
                    ctx.answerCbQuery('Successfully remove user as an Administrator for this group!');
                }

            } else {
                if(isCallback) {
                    ctx.answerCbQuery('User is not an administrator.');
                }
            }
        }
    }


}
