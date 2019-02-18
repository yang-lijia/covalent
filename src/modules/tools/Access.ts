import { ContextMessageUpdate } from 'telegraf';
import { getRepository } from 'typeorm';

import { Administrator } from '../../entity/Administrator';

export default {
    /**
     * Checks if the current user in the message context is an admin in the current chat
     * 
     * @param ctx - Telegram bot context.
     * @returns true if current user is an admin in the current group
     */
    async isAdmin(ctx: ContextMessageUpdate):Promise<boolean> {
        const adminRepo = getRepository(Administrator);

        const admin = await adminRepo
            .createQueryBuilder('administrator')
            .leftJoinAndSelect('administrator.chatgroups', 'chatgroup', 'chatgroup.chatgroupId = :chatgroupId', {
                chatgroupId: ctx.chat.id
            })
            .where('administrator.userId = :user Id', { userId: ctx.from.id })
            .getOne();

        return (admin && admin.chatgroups.length > 0);
    }
}