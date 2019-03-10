import { ContextMessageUpdate } from 'telegraf';
import { getRepository } from 'typeorm';
import { Administrator } from '../../entity/Administrator';
import { Chatgroup } from '../../entity/Chatgroup';
import ActiveSession from '../activeSession';

import { ChatMember } from 'telegram-typings';
import { CommandManager, CommandProcessor } from '../command';
import { Reply } from '../tools';

const Markup = require('telegraf/markup');

/**
 * A class to handle the general help command.
 */
export default class AdminTalent {
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
            'addadmin',
            'Add administrator to manage covalent',
            'Add administrator to manage covalent',
            this.showChatAdministratorsToBeAdded.bind(this),
        );
        this.commandManager.add(
            'removeadmin',
            'Remove administrator; remove his/her rights to manage covalent',
            'Remove administrator; remove his/her rights to manage covalent',
            this.showExistingAdministratorsToBeRemoved.bind(this),
        );
        this.commandManager.add(
            'viewadmin',
            'View administrators',
            'View administrators',
            this.showChatAdministrators.bind(this),
        );
    }

    private buildAdminButtons(adminList: ChatMember[]) {
        // We want 4 buttons per row for admin
        // There will always be at least 1 admin, hence totalBins >= 1.
        const buttons = [];
        let totalBins = Math.ceil(adminList.length / 4);
        while (totalBins > 0) {
            buttons.push([]);
            totalBins--;
        } // Buttons is now [[], [], ...], containing [] equal to no of bins.

        for (let i = 0; i < adminList.length; i++) {
            const admin = adminList[i];
            const bin = Math.floor(i / 4);
            buttons[bin].push(Markup.callbackButton(admin.user.first_name, admin.user.id.toString()));
        }
        buttons.push([]);
        buttons[buttons.length - 1].push(Markup.callbackButton('Exit!', 'exit'));
        return buttons;
    }

    async showChatAdministrators(ctx: ContextMessageUpdate) {
        const chatInfo = await ctx.getChat();
        const adminRepository = getRepository(Administrator);
        const currentAdmins = await adminRepository
            .createQueryBuilder('administrator')
            .leftJoinAndSelect('administrator.chatgroups', 'chatgroup')
            .where('chatgroup.chatgroupId = :chatgroupId', { chatgroupId: chatInfo.id })
            .getMany(); // Returns [] if no admins registered with chatgroup
        if (currentAdmins.length === 0) {
            ctx.reply('There are no Covalent administrators for this group. Please use /addadmin to add them!');
            return;
        }
        let adminList = '';
        for (const admin of currentAdmins) {
            const adminInfo = await ctx.getChatMember(admin.userId);
            const firstName = adminInfo.user.first_name;
            adminList += `- ${firstName}\n`;
        }
        ctx.replyWithMarkdown(`*Covalent administrators for this group:* \n${adminList}`);
    }

    async showChatAdministratorsToBeAdded(ctx: ContextMessageUpdate) {
        const chatInfo = await ctx.getChat();
        // Need to check if chat is registered/unregistered.
        // A bot being added to a new group doesn't need to have /start to talk to the group.
        // Make registration transparent to user
        const chatgroupRepo = getRepository(Chatgroup);
        const currentChatgroup = chatgroupRepo.findOne({
            chatgroupId: chatInfo.id,
        });

        // If group isn't registered yet, register it
        if (!currentChatgroup) {
            const newChatgroup = chatgroupRepo.create({
                chatgroupId: chatInfo.id,
                name: chatInfo.title,
            });
            await chatgroupRepo.save(newChatgroup);
        }

        const chatAdministrators = await ctx.getChatAdministrators();
        const adminRepository = getRepository(Administrator);
        const currentAdmins = await adminRepository
            .createQueryBuilder('administrator')
            .leftJoinAndSelect('administrator.chatgroups', 'chatgroup')
            .where('chatgroup.chatgroupId = :chatgroupId', { chatgroupId: chatInfo.id })
            .getMany(); // Returns [] if no admins registered with chatgroup

        const newAdmins = chatAdministrators
            .filter((chatAdministrator) =>
                !currentAdmins.find((currentAdmin) =>
                    currentAdmin.userId === chatAdministrator.user.id));
        if (newAdmins.length > 0) {
            const buttons = this.buildAdminButtons(newAdmins);

            const message = ctx.update.message;

            ActiveSession.startSession('addAdministrator', chatInfo.id, message);

            // Use a one-time keyboard to add the admin.
            Reply.replyInlineKeyboard(ctx, 'Who shall be a Covalent administrator for this group?', buttons);
        } else {
            ctx.reply('All chat administrators are already Covalent administrators');
        }
    }

    /**
     * Adds administrator to a registered chat group
     */
    async addAdministrator(ctx: ContextMessageUpdate) {
        // check if is exit; kill session
        // else we add administrator
        const callbackQuery = ctx.update.callback_query;
        const chatgroupId = callbackQuery.message.chat.id;

        // End the session first
        ActiveSession.endSession(chatgroupId);

        if (callbackQuery.data === 'exit') {
            Reply.handleCancelledOperation(ctx, 'Add administrator', chatgroupId);
            return;
        }

        const userId: number = Number.parseInt(callbackQuery.data, 10);
        const newAdminDetails = await ctx.getChatMember(userId);

        const chatgroupRepo = getRepository(Chatgroup);
        const chatgroup = await chatgroupRepo.findOne({
            chatgroupId,
        });
        if (!chatgroup) {
            throw new Error('Chat group is not registered with Covalent.');
        }

        const administratorRepo = getRepository(Administrator);
        const administrator = await administratorRepo.findOne({
            userId,
        });

        if (administrator) {
            const found = administrator.chatgroups.find((group) => {
                return group.chatgroupId === chatgroupId;
            });
            if (found) {
                ctx.answerCbQuery(`${newAdminDetails.user.first_name} is already an administrator for this group!`);
                ctx.editMessageText(`${newAdminDetails.user.first_name} is already an administrator for this group!`);
                return;
            } else {
                administrator.chatgroups.push(chatgroup);
                await administratorRepo.save(administrator);
            }
        } else {
            const newAdministrator = new Administrator();
            newAdministrator.userId = userId;
            newAdministrator.chatgroups = [chatgroup];
            await administratorRepo.save(newAdministrator);
        }
        ctx.answerCbQuery(`Added ${newAdminDetails.user.first_name} as a Covalent admin!`);
        ctx.editMessageText(`Added ${newAdminDetails.user.first_name} as a Covalent admin!`);
    }

    async showExistingAdministratorsToBeRemoved(ctx: ContextMessageUpdate) {
        const chatInfo = await ctx.getChat();
        const adminRepository = getRepository(Administrator);
        const currentAdmins = await adminRepository
            .createQueryBuilder('administrator')
            .leftJoinAndSelect('administrator.chatgroups', 'chatgroup')
            .where('chatgroup.chatgroupId = :chatgroupId', { chatgroupId: chatInfo.id })
            .getMany();
        if (currentAdmins.length > 0) {
            const currentAdminDetails = await Promise.all(currentAdmins.map(async (admin) => {
                return await ctx.getChatMember(admin.userId);
            }));
            const buttons = this.buildAdminButtons(currentAdminDetails);

            const message = ctx.update.message;

            ActiveSession.startSession('deleteAdministrator', chatInfo.id, message);

            Reply.replyInlineKeyboard(ctx, 'Remove a user as a Covalent administrator', buttons);
        } else {
            ctx.reply('There are no administrators registered for this chat. Please use /addadmin to add them!');
        }
    }

    async deleteAdministrator(ctx: ContextMessageUpdate, isCallback: boolean) {
        // check if is exit; kill session
        // else we delete administrator
        const chatgroupId = isCallback ? ctx.update.callback_query.message.chat.id : ctx.update.message.chat.id;
        // End the session first
        ActiveSession.endSession(chatgroupId);

        if (isCallback && ctx.update.callback_query.data === 'exit') {
            Reply.handleCancelledOperation(ctx, 'Delete administrator', chatgroupId);
            return;
        }
        const userId = isCallback ?
            Number.parseInt(ctx.update.callback_query.data, 10) :
            ctx.update.message.left_chat_member.id;
        const userInfo = await ctx.getChatMember(userId);
        const administratorRepo = getRepository(Administrator);
        const administrator = await administratorRepo.findOne({
            userId,
        });

        if (administrator && administrator.chatgroups.length > 0) {
            if (administrator.chatgroups.length === 1 &&
                administrator.chatgroups.find((chatgroup) => chatgroup.chatgroupId === chatgroupId)) {
                await administratorRepo.remove(administrator);
            } else {
                const index = administrator.chatgroups.findIndex((chatgroup) => chatgroup.chatgroupId === chatgroupId);
                if (index !== -1) {
                    administrator.chatgroups.splice(index, 1);
                    await administratorRepo.save(administrator);
                }
            }
            if (isCallback) {
                ctx.answerCbQuery(`${userInfo.user.first_name} is no longer a Covalent administrator.`);
                ctx.editMessageText(`${userInfo.user.first_name} is no longer a Covalent administrator.`);
            }
        } else {
            if (isCallback) {
                ctx.answerCbQuery(`${userInfo.user.first_name} is not a Covalent administrator.`);
                ctx.editMessageText(`${userInfo.user.first_name} is not a Covalent administrator.`);
            }
        }
    }
}
