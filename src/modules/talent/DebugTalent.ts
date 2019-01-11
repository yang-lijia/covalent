import {getRepository} from 'typeorm';
import { CommandManager, CommandProcessor } from '../command';

import { ContextMessageUpdate } from 'telegraf';
import * as Entities from '../../entity';

export default class DebugTalent {
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
        commandManager.add(
            'debug',
            'For debugging purposes',
            '/debug [message | ]',
            this.debugTable.bind(this),
        );
    }

    async debugTable(ctx: ContextMessageUpdate) {
        ctx.reply(JSON.stringify(ctx.message, null , 2));
    }
}
