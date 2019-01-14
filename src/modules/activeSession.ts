
/*
 * Use to keep track of active sessions
 * */
let activeSessions = {};

export default {

    getSession(chatId){
        return activeSessions[chatId];
    },

    startSession(action, chatId){
        activeSessions[chatId] = { action: action };
    },

    endSession(chatId){
        delete activeSessions[chatId];
    }
}

