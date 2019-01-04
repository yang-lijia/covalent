import { ContextMessageUpdate } from 'telegraf';

const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');

// The default time interval for each poke when we do poke all.
// let sleeptime = 500;

/**
 * A tools module to consolidate all the small functions
 */
export default {

    /**
     * A generic function to reply a text message and remove the keyboard.
     * @param ctx - Telegram bot context.
     * @param htmlText - The text to reply.
     */
    replyHTML(ctx: ContextMessageUpdate, htmlText: string) {

        return ctx.replyWithHTML(htmlText,
            Markup.removeKeyboard()
                  .extra(Extra.inReplyTo(ctx.message.message_id)),
            );
    },

    /**
     * A generic function to reply a text message and remove the keyboard.
     * Send to the chatID instead of the telegram context.
     *
     * @param ctx - The telegram group chat to reply to.
     * @param htmlText - The text to reply.
     * @param chatid - The reply will be pipe to this chatid instead of the chat in the ctx.
     */
    replyHTMLChatID(ctx: ContextMessageUpdate, htmlText: string, chatid: string | number) {

        return ctx.telegram.sendMessage(chatid, htmlText, Markup
            .removeKeyboard()
            .extra(Extra.HTML()));
    },

    /**
     * A generic function to reply a text message and a keyboard.
     * @param ctx - Telegram bot context.
     * @param htmlText - The text to reply.
     * @param [options] - The list of options to display in the keyboard.
     */
    replyKeyboard(ctx: ContextMessageUpdate, htmlText: string, options: any) {

        //
        // There is a bug with the selective() option.
        // Selective() only works for phone apps. Desktop and Web versions will still show.
        //

        return ctx.replyWithHTML(htmlText, Markup
            .keyboard(options)
            .selective()
            .oneTime()
            .resize()
            .extra(Extra.inReplyTo(ctx.message.message_id)),
        );
    },

    /**
     * A generic function to reply a text message and a keyboard.
     * @param ctx - Telegram bot context.
     * @param htmlText - The text to reply.
     * @param [options] - The list of options to display in the keyboard.
     */
    replyInlineKeyboard(ctx: ContextMessageUpdate, htmlText: string, options: any) {

        return ctx.replyWithHTML(htmlText, Markup
            .selective()
            .oneTime()
            .resize()
            .extra(Extra.HTML().markup( (m) => m.inlineKeyboard(options))),
        );
    },
};
