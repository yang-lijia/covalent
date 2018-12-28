/**
 * A small object to keep some command data.
 */
export default class Command {
    cmd: string;
    help: string;
    detailHelp: string;
    supercmd: boolean;
    fn: any;

    /**
     * Initialise the data required to define a command.
     * @param cmd: String - A command in text.
     * @param help: String - A simple help of the function.
     * @param detailHelp: String: A detailed help to teach people hpw to use the command.
     * @param supercmd: Boolean - State whether this command is only available for super user.
     * @param fn: function - The function to call for this command.
     */
    constructor(cmd:string, help:string, detailHelp:string, supercmd:boolean, fn:any) {

        this.cmd = cmd;
        this.help = help;
        this.detailHelp = detailHelp;
        this.supercmd = supercmd;
        this.fn = fn;
    }
}