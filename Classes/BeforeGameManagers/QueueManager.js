module.exports = class QueueManager {
    constructor() {
        this.conquestGamesQueueUsers = [];
        this.conquestGamesQueueSockets = [];
        this.conquestGames = [];
    }

    addUserToQueue(id, user, socket) {
        this.conquestGamesQueueUsers[id] = user;
        this.conquestGamesQueueSockets[id] = socket;
        if (this.conquestGamesQueueSockets.length >= 2) {
            console.log("ready for game");

        }
    }
}