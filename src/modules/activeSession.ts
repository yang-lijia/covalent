import { Message } from 'telegram-typings';
import config from '../config';

/**
 * Singleton object exported to keep sessions of user actions
 */
const activeSessions = {};

export enum SessionAction {
    AddAdmin = 'Add administrator',
    RemoveAdmin = 'Remove administrator',
}

export default {
    getSession(chatId: number): { action: SessionAction; message: Message } {
        return activeSessions[chatId];
    },

    startSession(
        action: SessionAction,
        chatId: number,
        message: Message,
        options?: { timeout: number },
    ) {
        activeSessions[chatId] = { action, message };
        const timeout =
            options && options.timeout
                ? options.timeout
                : config.SessionTimeout;
        setTimeout(() => {
            this.endSession(chatId);
        }, timeout);
    },

    endSession(chatId: number) {
        delete activeSessions[chatId];
    },
};
