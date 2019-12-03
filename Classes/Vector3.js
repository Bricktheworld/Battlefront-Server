module.exports = class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    update(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}