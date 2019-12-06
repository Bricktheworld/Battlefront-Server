const shortID = require('shortid');

module.exports = class User {
    constructor(email, username, password, id) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.id = shortID.generate();
    }
}