const io = require('socket.io')(process.env.PORT || 80);
const LoginLobby = io.of('/login-lobby')


console.log('Server has Started');

const Player = require('./Classes/ActualGame/Player.js');
const GameManager = require('./Classes/ActualGame/GameManager.js');
const Vector3 = require('./Classes/ActualGame/Vector3.js');
const Quaternion = require('./Classes/ActualGame/Quaternion.js');
const User = require('./Classes/User.js');
const LoginManager = require('./Classes/BeforeGameManagers/LoginManager.js')
const QueueManager = require('./Classes/BeforeGameManagers/QueueManager.js');
const shortID = require('shortid');


// let players = [];
let sockets = [];
let users = [];
let loginManager = new LoginManager();
let queueManager = new QueueManager();
const redis = require('redis')
let client = redis.createClient(process.env.REDIS_URL || "redis://h:p5dc5ea230fe562f6d62e93eb26d0db4b244d4d43585254dc086b206ee966485b@ec2-34-232-25-133.compute-1.amazonaws.com:28069");

// //testing shit, it works
// let testId = shortID.generate;
// let testUser = new User("Joe@joe.joe", "Bricktheworld", "passw0rd", testId);
// client.set("Joe@joe.joe", JSON.stringify(testUser))

// client.get("Joe@joe.joe", (err, reply) => {
//     // reply is null when the key is missing
//     console.log(reply);
//     if (reply == null)
//         return;
//     let output = JSON.parse(reply);
//     console.log(output['password']);
// });

io.on('connection', socket => {
    console.log('Connection Made!');


    // let player = new Player();
    // let playerID = player.id;

    // players[playerID] = player;
    let user;
    let userID;
    // socket.emit('init', { id: playerID });
    // socket.emit('spawnSelf', player);
    // socket.broadcast.emit('spawnNew', player);

    socket.on('loginToServer', (data) => {
        client.get(data.email, (err, reply) => {
            if (reply == null) {
                socket.emit('loginFailed');
                return;
            } else {
                let output = JSON.parse(reply);
                if (data.password == output['password']) {
                    user = new User(output['username'], output['password'], output['id']);
                    userID = user.id;
                    users[userID] = user;
                    sockets[userID] = socket;
                    console.log("logged into account by username: " + output['username'])
                    socket.emit("loginSuccess", (user));
                    loginManager.addUser(userID, users[userID], sockets[userID]);
                } else {
                    socket.emit('loginFailed');
                }
            }
        });
    })

    socket.on('createAccount', (data) => {
        let exists = false;
        client.get(data.email, (err, reply) => {
            if (reply != null) {
                exists = true;
                socket.emit('accountAlreadyExists')
                return;
            } else {
                user = new User(data.email, data.username, data.password, shortID.generate());
                userID = user.id;
                users[userID] = user;
                sockets[userID] = socket;
                client.set(user.email, JSON.stringify(user));
                socket.emit('accountCreatedSuccessfully', user);
            }
        })
    })

    socket.on('updatePositioning', (data) => {
        player.setPosition(data.x, data.y, data.z);
        player.setRotation(data.rotX, data.rotY, data.rotZ, data.rotW);
        socket.broadcast.emit('updatePosition', player);
    })

    socket.on('queueForGame', (data) => {
        console.log("put in q for conquest game");
        queueManager.addUserToQueue(userID, user, socket);
    })


    // for (let _playerID in players) {
    //     if (_playerID != playerID) {
    //         socket.emit('spawnNew', players[_playerID]); //init other players already in game
    //     }
    // }

    socket.on('disconnect', () => {
        console.log('Player disconnected');
        delete users[userID]
        delete sockets[userID];
        // socket.broadcast.emit('removePlayer', { id: user.id })
    })
})