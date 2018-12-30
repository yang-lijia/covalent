"use strict";
exports.__esModule = true;
var command_model_1 = require("./command.model");
/**
 * A class used to represent a a command and its necessary information.
 * It has some functions to handle access control for commands and super commands.
 * It has some helper functions to retrieve help and detailHelp.
 */
var CommandManager = /** @class */ (function () {
    /**
     * Initialise an empty array first.
     */
    function CommandManager() {
        this.commandArray = [];
    }
    Object.defineProperty(CommandManager.prototype, "commands", {
        /**
         * A getter function in case we want to do some processing.
         */
        get: function () {
            return this.commandArray;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add a command into the command list.
     * @param cmd: String - A command in text.
     * @param help: String - A simple help of the function.
     * @param detailedHelp: String: A detailed help to teach people hpw to use the command.
     * @param fn: Function - The function to call for this command.
     * @return {object} : Object - Returns the newly created command object.
     */
    CommandManager.prototype.add = function (cmd, help, detailedHelp, fn) {
        var newCmd = new command_model_1["default"](cmd, help, detailedHelp, false, fn);
        this.commandArray.push(newCmd);
        return newCmd;
    };
    /**
     * Add a super command into the command list.
     * @param cmd: String - A command in text.
     * @param help: String - A simple help of the function.
     * @param detailedHelp: String: A detailed help to teach people hpw to use the command.
     * @param fn: Function - The function to call for this command.
     * @return {object} : Object - Returns the newly created command object.
     */
    CommandManager.prototype.addSuper = function (cmd, help, detailedHelp, fn) {
        var newCmd = new command_model_1["default"](cmd, help, detailedHelp, true, fn);
        this.commandArray.push(newCmd);
        return newCmd;
    };
    /**
     * Combined all the help into a single string and return.
     * @param supercmd: Boolean - State whether we want to show super commands or not.
     * @return String - The combined help string.
     */
    CommandManager.prototype.getAllHelp = function (supercmd) {
        if (supercmd === void 0) { supercmd = false; }
        var help = 'List of commands:\n';
        this.commandArray.forEach(function (element) {
            if (element.supercmd === false) {
                help = help + '/' + element.cmd + ' - ' + element.help + '\n';
            }
        });
        if (supercmd) {
            help = help + '\nSuper user commands:\n';
            this.commandArray.forEach(function (element) {
                if (element.supercmd === true) {
                    help = help + '/' + element.cmd + ' - ' + element.help + '\n';
                }
            });
        }
        return help;
    };
    /**
     * Get the detailed help of a command.
     * @param command: String - The command to retrieve the detail.
     * @param superuser: Boolean - State whether this command is only available for super user.
     * @return String - The detail help of the command if found. Return "invalid..." if not found.
     */
    CommandManager.prototype.getDetailHelp = function (command, superuser) {
        if (superuser === void 0) { superuser = false; }
        for (var i = 0; i < this.commandArray.length; ++i) {
            var element = this.commandArray[i];
            if (element.cmd === command) {
                // If this is not a super command, we can return the help.
                if (element.supercmd === false) {
                    return element.detailHelp;
                }
                else {
                    // If this is a super command, we need to make sure this is requested by a super user.
                    if (superuser === true) {
                        return element.detailHelp;
                    }
                }
            }
        }
        return 'Invalid help command!';
    };
    /**
     * Simple function to register all the command to the telegram bot.
     * @param bot: telegram bot object - The bot to register all the commands to.
     */
    CommandManager.prototype.registerToBot = function (bot) {
        this.commandArray.forEach(function (element) {
            bot.command(element.cmd, element.fn);
        });
    };
    return CommandManager;
}());
exports["default"] = CommandManager;
