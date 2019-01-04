/**
 * A class used to parse a text into command and parameters...
 */
import { ContextMessageUpdate } from 'telegraf';

export default class CommandProcessor {

    /**
     * Empty for now.....
     */
    constructor() {
    }

    /**
     *
     * @param ctx - Telegram bot context.
     * @returns - An object containing the command and up to 3 parameters.
     *              {{numberOfParams: number, cmd: string, param1: string, param2: string, param3: string, param4: string, params: Array}}
     */
    process(ctx: ContextMessageUpdate) {

        const command = {
            numberOfParams: 0,
            cmd: '',
            param1: '',
            param2: '',
            param3: '',
            param4: '',
            params: [],
        };

        // Split the string with a [space] character
        const splitstring = ctx.update.message.text.split(' ');

        command.cmd = splitstring[0];
        command.numberOfParams = splitstring.length - 1;

        if (splitstring.length > 1) {
            command.param1 = splitstring[1];
            command.params.push(command.param1);
        }

        if (splitstring.length > 2) {
            command.param2 = splitstring[2];
            command.params.push(command.param2);
        }

        if (splitstring.length > 3) {
            command.param3 = splitstring[3];
            command.params.push(command.param3);
        }

        if (splitstring.length > 4) {
            command.param4 = splitstring[4];
            command.params.push(command.param4);
        }

        return command;
    }
}
