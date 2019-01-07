import {getRepository} from 'typeorm';
import { CommandManager, CommandProcessor } from '../command';

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
        // commandManager.add(
        //     'help',
        //     'Display basic help.',
        //     '/help [command]\n- Display more detail help. 👍',
        //     undefined,
        // );
    }
}
