module.exports = class LoginManager {
    constructor() {
        this.users = []
        this.sockets = [];
    }

    addUser(id, user, socket) {
        this.users[id] = user;
        this.sockets[id] = socket;
        this.setupSocketEvents(socket);
    }

    setupSocketEvents(socket) {
        socket.on("queueForGame", (data) => {
            console.log("in q");
        })
    }
}