import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import ActiveSession from './modules/activeSession';
import { CommandManager, CommandProcessor } from './modules/command';
import { DebugTalent, HappyTalent, HelpTalent, RegisterTalent, SurveyTalent, AdminTalent } from './modules/talent';

import Telegraf from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

const cmdProcessor = new CommandProcessor();
const cmdManager = new CommandManager();

// All the Talent that the bot can do. :)
const happyTalent = new HappyTalent(cmdManager, cmdProcessor);
const helpTalent = new HelpTalent(cmdManager, cmdProcessor);
const registerTalent = new RegisterTalent(cmdManager, cmdProcessor);
const adminTalent = new AdminTalent(cmdManager, cmdProcessor);
const surveyTalent = new SurveyTalent(cmdManager, cmdProcessor);
if (process.env.NODE_ENV !== 'production') {
    const debugTalent = new DebugTalent(cmdManager, cmdProcessor);
}

async function init() {
    // Initialize database
    try {
        const connection = await createConnection();
        console.log('Connection created:');
        console.log(JSON.stringify(connection.options, null, 2));
    } catch (error) {
        console.error(error);
        return -1;
    }

    // Call this to register all the commands to the bot.
    cmdManager.registerToBot(bot);

    // Handle callbacks (button presses)
    bot.on('callback_query', (ctx) => {
        const chatId = ctx.update.callback_query.message.chat.id;

        const currentSession = ActiveSession.getSession(chatId);
        const msgDate = ctx.update.callback_query.message.date;

        if ( (currentSession && msgDate < currentSession.message.date) || !currentSession) {
            // Old replies
            ctx.editMessageText('This message has timed out. Kindly issue another command.');
            return;
        }

        try {
            const action = ActiveSession.getSession(chatId).action;
            switch (action) {
                case 'addAdministrator':
                    adminTalent.addAdministrator(ctx);
                    break;
                case 'deleteAdministrator':
                    adminTalent.deleteAdministrator(ctx, true);
                    break;
                default:
                    break;
            }
        } catch (exception) {
            console.error(exception);
        }

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

    // Bot needs to know when an admin leaves a group
    bot.on('left_chat_member', (ctx) => {
        adminTalent.deleteAdministrator(ctx, false);
    });

    // Handler for /start command
    bot.start((ctx) => ctx.reply('Be happy and awesome. Help others to be happy and awesome! 😁'));

    // Start polling for messages
    bot.startPolling();
}

init();
