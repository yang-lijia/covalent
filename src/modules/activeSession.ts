
/*
 * Use to keep track of active sessions
 * */
const activeSessions = {};

export default {

    getSession(chatId) {
        return activeSessions[chatId];
    },

    startSession(action, chatId, msg) {
        activeSessions[chatId] = { action: action, message: msg };
    },

    endSession(chatId) {
        delete activeSessions[chatId];
    },
};
