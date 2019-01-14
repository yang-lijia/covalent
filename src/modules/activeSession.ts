
/*
 * Use to keep track of active sessions
 * */
const activeSessions = {};

export default {

    getSession(chatId) {
        return activeSessions[chatId];
    },

    startSession(action, chatId) {
        activeSessions[chatId] = { action };
    },

    endSession(chatId) {
        delete activeSessions[chatId];
    },
};
