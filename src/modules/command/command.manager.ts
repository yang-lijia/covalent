import { Telegraf, ContextMessageUpdate } from 'telegraf';
import Command from './command.model';

/**
 * A class used to represent a a command and its necessary information.
 * It has some functions to handle access control for commands and super commands.
 * It has some helper functions to retrieve help and detailHelp.
 */
export default class CommandManager {

    private commandArray:Array<Command>;

    /**
     * Initialise an empty array first.
     */
    constructor() {
        this.commandArray = [];
    }

    /**
     * A getter function in case we want to do some processing.
     */
    get commands():Array<Command> {
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
    add(cmd:string, help:string, detailedHelp:string, fn:any):Command {
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
    addSuper(cmd:string, help:string, detailedHelp:string, fn:any):Command {
        let newCmd = new Command(cmd, help, detailedHelp, true, fn);
        this.commandArray.push(newCmd);

        return newCmd;
    }

    /**
     * Combined all the help into a single string and return.
     * @param supercmd: Boolean - State whether we want to show super commands or not.
     * @return String - The combined help string.
     */
    getAllHelp(supercmd:boolean = false):string {

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
    getDetailHelp(command:string, superuser:boolean = false):string {

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
    registerToBot(bot:Telegraf<ContextMessageUpdate>):void {
        this.commandArray.forEach((element) => {
            bot.command(element.cmd, element.fn)
       });
    }
}