
import { createConnection } from 'typeorm';
import { CommandManager, CommandProcessor } from './modules/command';
import { HappyTalent, HelpTalent } from './modules/talent';

import 'reflect-metadata';
import Telegraf from 'telegraf';

import * as dotenv from 'dotenv';
dotenv.config();

//const bot: Telegraf<ContextMessageUpdate> = new Telegraf(process.env.BOT_TOKEN);

const bot = new Telegraf(process.env.BOT_TOKEN);

const cmdProcessor = new CommandProcessor();
const cmdManager = new CommandManager();

// All the Talent that the bot can do. :)
const happyTalent = new HappyTalent(cmdManager, cmdProcessor);
const helpTalent = new HelpTalent(cmdManager, cmdProcessor);

function init() {

    // Initialize database
    createConnection().then(async (connection) => {
        console.log('Initializing Database');
    }).catch((error) => console.log(`Error : ${error}`));

    // Call this to register all the commands to the bot.
    cmdManager.registerToBot(bot);

    // This starts the bot...
    bot.start((ctx) => ctx.reply('Be happy and awesome. Help others to be happy and awesome! 😁'));
    bot.startPolling();

    bot.on('callback_query', (ctx) => {
        /*
        *TODO:
         * Store the response based on group
          * Send ACK upon response
          * E.g. ctx.answerCbQuery('If you are happy and you know it, clap your hands!');
          * Hide the button when survey is over
          * ctx.editMessageText()
          * Need to think about how we gonna do this... Imagine if there is a lot of group and user
        */

    });
}

init();