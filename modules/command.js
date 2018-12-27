/**
 * Created by john_tng on 21/6/18.
 */

/**
 * A class used to represent a a command and its necessary information.
 * It has some functions to handle access control for commands and super commands.
 * It has some helper functions to retrieve help and detailHelp.
 */

class CommandManager {

    /**
     * Initialise an empty array first.
     */
    constructor() {
        this.commandArray = [];
    }

    /**
     * A getter function in case we want to do some processing.
     */
    get commands() {
        return this.commandArray;
    }

    /**
     * Add a command into the command list.
     * @param cmd: String - A command in text.
     * @param help: String - A simple help of the function.
     * @param detailedHelp: String: A detailed help to teach people hpw to use the command.
     * @param fn: Function - The function to call for this command.
     * @return {object} : Object - Returns the newly created command object.
     */
    add(cmd, help, detailedHelp, fn) {
        let newCmd = new Command(cmd, help, detailedHelp, false, fn);
        this.commandArray.push(newCmd);
        return newCmd;
    }

    /**
     * Add a super command into the command list.
     * @param cmd: String - A command in text.
     * @param help: String - A simple help of the function.
     * @param detailedHelp: String: A detailed help to teach people hpw to use the command.
     * @param fn: Function - The function to call for this command.
     * @return {object} : Object - Returns the newly created command object.
     */
    addSuper(cmd, help, detailedHelp, fn) {
        let newCmd = new Command(cmd, help, detailedHelp, true, fn);
        this.commandArray.push(newCmd);
        return newCmd;
    }

    /**
     * Combined all the help into a single string and return.
     * @param supercmd: Boolean - State whether we want to show super commands or not.
     * @return String - The combined help string.
     */
    getAllHelp(supercmd) {

        let help = 'List of commands:\n';

        this.commandArray.forEach((element) => {
            if(element.supercmd === false) {
            help = help + '/' + element.cmd + ' - ' + element.help + '\n';
        }
    });

        if(supercmd) {

            help = help + '\nSuper user commands:\n';

            this.commandArray.forEach((element) => {
                if(element.supercmd === true) {
                help = help + '/' + element.cmd + ' - ' + element.help + '\n';
            }
        });
        }

        return help;
    }

    /**
     * Get the detailed help of a command.
     * @param command: String - The command to retrieve the detail.
     * @param superuser: Boolean - State whether this command is only available for super user.
     * @return String - The detail help of the command if found. Return "invalid..." if not found.
     */
    getDetailHelp(command, superuser) {

        for(let i = 0; i < this.commandArray.length; ++i) {

            let element = this.commandArray[i];
            if(element.cmd === command) {

                // If this is not a super command, we can return the help.
                if(element.supercmd === false) {
                    return element.detailHelp;
                } else {

                    // If this is a super command, we need to make sure this is requested by a super user.
                    if(superuser === true) {
                        return element.detailHelp;
                    }
                }
            }
        }

        return 'Invalid help command!';
    }

    /**
     * Simple function to register all the command to the telegram bot.
     * @param bot: telegram bot object - The bot to register all the commands to.
     */
    registerToBot(bot) {
        this.commandArray.forEach((element) => {
            bot.command(element.cmd, element.fn)
    });
    }
}

/**
 * A small object to keep some command data.
 */
class Command {

    /**
     * Initialise the data required to define a command.
     * @param cmd: String - A command in text.
     * @param help: String - A simple help of the function.
     * @param detailHelp: String: A detailed help to teach people hpw to use the command.
     * @param supercmd: Boolean - State whether this command is only available for super user.
     * @param fn: function - The function to call for this command.
     */
    constructor(cmd, help, detailHelp, supercmd, fn) {

        this.cmd = cmd;
        this.help = help;
        this.detailHelp = detailHelp;
        this.supercmd = supercmd;
        this.fn = fn;
    }
}

/**
 * A class used to parse a text into command and parameters...
 */
class CommandProcessor {

    /**
     * Empty for now.....
     */
    constructor() {

    }

    /**
     *
     * @param ctx - Telegram bot context.
     * @returns {object} - An object containing the command and up to 3 parameters.
     *              {{numberOfParams: number, cmd: string, param1: string, param2: string, param3: string, param4: string, params: Array}}
     */
    process(ctx) {

        let command = {
            numberOfParams: 0,
            cmd: '',
            param1: '',
            param2: '',
            param3: '',
            param4: '',
            params:[]
        };

        // Split the string with a [space] character
        let splitstring = ctx.update.message.text.split(' ');

        command.cmd = splitstring[0];
        command.numberOfParams = splitstring.length -1;

        if(splitstring.length > 1) {
            command.param1 = splitstring[1];
            command.params.push(command.param1);
        }

        if(splitstring.length > 2) {
            command.param2 = splitstring[2];
            command.params.push(command.param2);
        }

        if(splitstring.length > 3) {
            command.param3 = splitstring[3];
            command.params.push(command.param3);
        }

        if(splitstring.length > 4) {
            command.param4 = splitstring[4];
            command.params.push(command.param4);
        }

        return command;
    }
}

module.exports = { CommandManager, CommandProcessor };