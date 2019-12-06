const Vector3 = require('./Vector3.js');
const Quaternion = require('./Quaternion.js');


module.exports = class Player {
    constructor(id, username) {
        this.username = username;
        this.id = id;
        this.team = null
        this.position = new Vector3(0, 0, 0);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;
        this.rotW = 0;
        this.lookRotation = new Quaternion(0, 0, 0, 0)
        this.movementDirection = new Vector3(0, 0, 0);
    }

    setTeam(team) {
        this.team = team;
    }

    setPosition(x, y, z) {
        this.position = new Vector3(x, y, z);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setRotation(x, y, z, w) {
        this.lookRotation = new Quaternion(x, y, z, w)
        this.rotX = x;
        this.rotY = y;
        this.rotZ = z;
        this.rotW = w;
    }

}

