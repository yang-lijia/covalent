"use strict";
exports.__esModule = true;
/**
 * A small object to keep some command data.
 */
var Command = /** @class */ (function () {
    /**
     * Initialise the data required to define a command.
     * @param cmd: String - A command in text.
     * @param help: String - A simple help of the function.
     * @param detailHelp: String: A detailed help to teach people hpw to use the command.
     * @param supercmd: Boolean - State whether this command is only available for super user.
     * @param fn: function - The function to call for this command.
     */
    function Command(cmd, help, detailHelp, supercmd, fn) {
        this.cmd = cmd;
        this.help = help;
        this.detailHelp = detailHelp;
        this.supercmd = supercmd;
        this.fn = fn;
    }
    return Command;
}());
exports["default"] = Command;
