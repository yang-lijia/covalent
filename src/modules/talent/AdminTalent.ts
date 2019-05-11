import { ContextMessageUpdate, Markup } from 'telegraf';
import {
    ExtraEditMessage,
    ExtraReplyMessage,
} from 'telegraf/typings/telegram-types';
import {
    CallbackQuery,
    Chat,
    ChatMember,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Message,
} from 'telegram-typings';
import { getRepository, Repository } from 'typeorm';
import { Administrator } from '../../entity/Administrator';
import { Chatgroup } from '../../entity/Chatgroup';
import ActiveSession, { SessionAction } from '../activeSession';
import { CommandManager } from '../command';
import { Reply } from '../tools';

export default class AdminTalent {
    private commandManager: CommandManager;

    constructor(commandManager: CommandManager) {
        this.commandManager = commandManager;
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

    private buildAdminButtons(adminList: ChatMember[]): InlineKeyboardMarkup {
        // We want 4 buttons per row for admin
        // There will always be at least 1 admin, hence totalBins >= 1.
        const buttons: InlineKeyboardButton[][] = [];
        let totalBins = Math.ceil(adminList.length / 4);
        while (totalBins > 0) {
            buttons.push([]);
            totalBins--;
        } // Buttons is now [[], [], ...], containing [] equal to no of bins.

        for (let i = 0; i < adminList.length; i++) {
            const admin = adminList[i];
            const bin = Math.floor(i / 4);
            const button: InlineKeyboardButton = Markup.callbackButton(
                admin.user.first_name,
                admin.user.id.toString(),
            );
            buttons[bin].push(button);
        }
        buttons.push([]);
        buttons[buttons.length - 1].push(
            Markup.callbackButton('Exit!', 'exit'),
        );
        return {
            inline_keyboard: buttons,
        };
    }

    // Returns admin that was removed, or throws error
    private async removeAdministrator(
        chatgroupId: number,
        adminUserId: number,
    ): Promise<Administrator> {
        const administratorRepo = getRepository(Administrator);
        const administrator = await administratorRepo.findOne({
            userId: adminUserId,
        });
        if (!administrator) {
            throw new Error(
                `Could not find admin in database when trying to remove them from chatgroup`,
            );
        }
        const chatgroupIndex = administrator.chatgroups.findIndex(
            (chatgroup) => chatgroup.chatgroupId === chatgroupId,
        );
        if (chatgroupIndex !== -1) {
            if (administrator.chatgroups.length === 1) {
                return await administratorRepo.remove(administrator);
            }
            administrator.chatgroups.splice(chatgroupIndex, 1);
            return await administratorRepo.save(administrator);
        } else {
            throw new Error(
                'Admin to be removed was not actually an admin for given chatgroup',
            );
        }
    }

    private async getAddableAdmins(
        ctx: ContextMessageUpdate,
    ): Promise<ChatMember[]> {
        const chatAdministrators: ChatMember[] = await ctx.getChatAdministrators();
        const adminRepository: Repository<Administrator> = getRepository(
            Administrator,
        );
        const currentAdmins: Administrator[] = await adminRepository
            .createQueryBuilder('administrator')
            .leftJoinAndSelect('administrator.chatgroups', 'chatgroup')
            .where('chatgroup.chatgroupId = :chatgroupId', {
                chatgroupId: ctx.chat.id,
            })
            .getMany(); // Returns [] if no admins registered with chatgroup
        return chatAdministrators.filter((chatAdministrator) => {
            return !currentAdmins.find(
                (currentAdmin) =>
                    currentAdmin.userId === chatAdministrator.user.id,
            );
        });
    }

    async showChatAdministrators(ctx: ContextMessageUpdate) {
        const chatInfo: Chat = await ctx.getChat();
        const adminRepository: Repository<Administrator> = getRepository(
            Administrator,
        );
        const currentAdmins: Administrator[] = await adminRepository
            .createQueryBuilder('administrator')
            .leftJoinAndSelect('administrator.chatgroups', 'chatgroup')
            .where('chatgroup.chatgroupId = :chatgroupId', {
                chatgroupId: chatInfo.id,
            })
            .getMany(); // Returns [] if no admins registered with chatgroup
        if (currentAdmins.length === 0) {
            ctx.reply(
                'There are no Covalent administrators for this group. Please use /addadmin to add them!',
            );
            return;
        }
        let adminList = '';
        for (const admin of currentAdmins) {
            const adminInfo = await ctx.getChatMember(admin.userId);
            const firstName = adminInfo.user.first_name;
            adminList += `- ${firstName}\n`;
        }
        ctx.replyWithMarkdown(
            `*Covalent administrators for this group:* \n${adminList}`,
        );
    }

    async showChatAdministratorsToBeAdded(ctx: ContextMessageUpdate) {
        const chatInfo: Chat = await ctx.getChat();
        // A bot being added to a new group doesn't need to have /start to talk to the group.
        // Make registration transparent to user
        const chatgroupRepo = getRepository(Chatgroup);
        const currentChatgroup = await chatgroupRepo.findOne({
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

        const addableAdmins: ChatMember[] = await this.getAddableAdmins(ctx);

        if (addableAdmins.length > 0) {
            const buttons: InlineKeyboardMarkup = this.buildAdminButtons(
                addableAdmins,
            );
            const addAdminKeyboardMarkup: ExtraReplyMessage = {
                reply_markup: buttons,
            };

            const message: Message = ctx.update.message;

            ActiveSession.startSession(
                SessionAction.AddAdmin,
                chatInfo.id,
                message,
            );

            // Use a one-time keyboard to add the admin.
            ctx.reply(
                'Who shall be a Covalent administrator for this group?',
                addAdminKeyboardMarkup,
            );
        } else {
            ctx.reply(
                'All chat administrators are already Covalent administrators',
            );
        }
    }

    async addAdministrator(ctx: ContextMessageUpdate) {
        const callbackQuery: CallbackQuery = ctx.update.callback_query;
        const chatgroupId: number = callbackQuery.message.chat.id;

        if (callbackQuery.data === 'exit') {
            Reply.handleCancelledOperation(ctx, SessionAction.AddAdmin);
            ActiveSession.endSession(chatgroupId);
            return;
        }

        const userId: number = Number.parseInt(callbackQuery.data, 10);
        const newAdminDetails = await ctx.getChatMember(userId);

        const chatgroupRepo = getRepository(Chatgroup);
        const chatgroup = await chatgroupRepo.findOne({
            chatgroupId,
        });
        if (!chatgroup) {
            throw new Error(
                'Chat group is not registered with Covalent. Did the chat group ID change?',
            );
        }

        const administratorRepo = getRepository(Administrator);
        const adminToBeAdded = await administratorRepo.findOne({
            userId,
        });

        if (adminToBeAdded) {
            const alreadyAdminOfChatgroup = adminToBeAdded.chatgroups.find(
                (group) => {
                    return group.chatgroupId === chatgroupId;
                },
            );
            if (alreadyAdminOfChatgroup) {
                ctx.answerCbQuery(
                    `${
                        newAdminDetails.user.first_name
                    } is already an administrator for this group!`,
                );
                ctx.editMessageText(
                    `${
                        newAdminDetails.user.first_name
                    } is already an administrator for this group!`,
                );
                return;
            } else {
                adminToBeAdded.chatgroups.push(chatgroup);
                await administratorRepo.save(adminToBeAdded);
            }
        } else {
            const newAdministrator = new Administrator();
            newAdministrator.userId = userId;
            newAdministrator.chatgroups = [chatgroup];
            await administratorRepo.save(newAdministrator);
        }

        ctx.answerCbQuery(
            `Added ${newAdminDetails.user.first_name} as a Covalent admin!`,
        );

        const addableAdmins = await this.getAddableAdmins(ctx);

        if (addableAdmins.length > 0) {
            const buttons: InlineKeyboardMarkup = this.buildAdminButtons(
                addableAdmins,
            );
            const addAdminKeyboardMarkup: ExtraEditMessage = {
                reply_markup: buttons,
            };
            ctx.editMessageText(
                'Who shall be a Covalent administrator for this group?',
                addAdminKeyboardMarkup,
            );
        } else {
            ctx.editMessageText(
                'All chat administrators are already Covalent administrators',
            );
        }
        ActiveSession.endSession(chatgroupId);
    }

    async showExistingAdministratorsToBeRemoved(ctx: ContextMessageUpdate) {
        const chatInfo = await ctx.getChat();
        const adminRepository = getRepository(Administrator);
        const currentAdmins = await adminRepository
            .createQueryBuilder('administrator')
            .leftJoinAndSelect('administrator.chatgroups', 'chatgroup')
            .where('chatgroup.chatgroupId = :chatgroupId', {
                chatgroupId: chatInfo.id,
            })
            .getMany();
        if (currentAdmins.length > 0) {
            const currentAdminDetails: ChatMember[] = await Promise.all(
                currentAdmins.map(async (admin) => {
                    return await ctx.getChatMember(admin.userId);
                }),
            );
            const buttons: InlineKeyboardMarkup = this.buildAdminButtons(
                currentAdminDetails,
            );
            const removeAdminKeyboardMarkup: ExtraReplyMessage = {
                reply_markup: buttons,
            };

            const message = ctx.update.message;

            ActiveSession.startSession(
                SessionAction.RemoveAdmin,
                chatInfo.id,
                message,
            );

            ctx.reply(
                'Remove a user as a Covalent administrator',
                removeAdminKeyboardMarkup,
            );
        } else {
            ctx.reply(
                'There are no administrators registered for this chat. Please use /addadmin to add them!',
            );
        }
    }

    async removeAdministratorButtonCallback(
        ctx: ContextMessageUpdate,
    ): Promise<void> {
        const chatgroupId = ctx.update.callback_query.message.chat.id;
        ActiveSession.endSession(chatgroupId);
        if (ctx.update.callback_query.data === 'exit') {
            Reply.handleCancelledOperation(ctx, SessionAction.RemoveAdmin);
            return;
        }
        const adminUserId = Number.parseInt(ctx.update.callback_query.data, 10);
        const adminInfo = await ctx.getChatMember(adminUserId);
        try {
            const removedAdmin = await this.removeAdministrator(
                chatgroupId,
                adminUserId,
            );
            ctx.answerCbQuery(
                `${
                    adminInfo.user.first_name
                } is no longer a Covalent administrator.`,
            );
            ctx.editMessageText(
                `${
                    adminInfo.user.first_name
                } is no longer a Covalent administrator.`,
            );
        } catch (exception) {
            ctx.answerCbQuery(
                `Error removing administrator: ${exception.message}`,
            );
            ctx.editMessageText(
                `Error removing administrator: ${exception.message}`,
            );
        }
    }

    async removeAdministratorOnLeftChat(
        ctx: ContextMessageUpdate,
    ): Promise<void> {
        const chatgroupId = ctx.update.message.chat.id;
        const adminUserId = ctx.update.message.left_chat_member.id;
        try {
            const removedAdmin = await this.removeAdministrator(
                chatgroupId,
                adminUserId,
            );
        } catch (exception) {
            // todo: log, send alert?
        }
    }

    async updateGroupId(ctx: ContextMessageUpdate) {
        const oldChatgroupId = ctx.update.message.chat.id;
        const newChatgroupId = ctx.update.message.migrate_to_chat_id;

        const chatgroupRepo = await getRepository(Chatgroup);
        const chatgroup = await chatgroupRepo.findOne({
            chatgroupId: oldChatgroupId,
        });

        if (chatgroup) {
            chatgroup.chatgroupId = newChatgroupId;
            await getRepository(Chatgroup).save(chatgroup);
        }
    }
}
