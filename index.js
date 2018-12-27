require('dotenv').config();

const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const Command = require('./modules/command');
const CommandProcessor = new Command.CommandProcessor();
const CommandManager = new Command.CommandManager();

// All the Talent that the bot can do. :)
new (require('./talent/helptalent'))(CommandManager, CommandProcessor);
new (require('./talent/happytalent'))(CommandManager, CommandProcessor);

function init(){

    // Call this to register all the commands to the bot.
    CommandManager.registerToBot(bot);

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