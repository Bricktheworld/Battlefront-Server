const io = require('socket.io')(process.env.PORT || 3000);

console.log('Server has Started');

let Player = require('./Classes/Player.js');
let GameManager = require('./Classes/GameManager.js');
let Vector3 = require('./Classes/Vector3.js');
let Quaternion = require('./Classes/Quaternion.js');


let players = [];
let sockets = [];

const client = require('redis').createClient(process.env.REDIS_URL);



io.on('connection', socket => {
    console.log('Connection Made!');


    let player = new Player();
    let playerID = player.id;

    players[playerID] = player;
    sockets[playerID] = socket;

    socket.emit('init', { id: playerID });
    socket.emit('spawnSelf', player);
    socket.broadcast.emit('spawnNew', player);

    socket.on('updatePositioning', (data) => {
        player.setPosition(data.x, data.y, data.z);
        player.setRotation(data.rotX, data.rotY, data.rotZ, data.rotW);
        socket.broadcast.emit('updatePosition', player);
    })



    for (let _playerID in players) {
        if (_playerID != playerID) {
            socket.emit('spawnNew', players[_playerID]); //init other players already in game
        }
    }

    socket.on('disconnect', () => {
        console.log('Player disconnected');
        delete players[playerID]
        delete sockets[playerID];
        socket.broadcast.emit('removePlayer', { id: player.id })
    })
})