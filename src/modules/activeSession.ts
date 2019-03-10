import { Message } from 'telegram-typings';

/*
 * Use to keep track of active sessions
 * */
const activeSessions = {};

export default {
    getSession(chatId: number) {
        return activeSessions[chatId];
    },

    startSession(action: string, chatId: number, message: Message) {
        activeSessions[chatId] = { action, message };
    },

    endSession(chatId: number) {
        delete activeSessions[chatId];
    },
};
