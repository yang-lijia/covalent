import { Message } from 'telegram-typings';

/**
 * Singleton object exported to keep sessions of user actions
 */
const activeSessions = {};

export enum SessionAction {
    AddAdmin = 'Add administrator',
    RemoveAdmin = 'Remove administrator',
}

export default {
    getSession(chatId: number) {
        return activeSessions[chatId];    },

    startSession(action: SessionAction, chatId: number, message: Message) {
        activeSessions[chatId] = { action, message };
    },

    endSession(chatId: number) {
        delete activeSessions[chatId];
    },
};
