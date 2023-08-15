require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes");
const DbConnect = require("./db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        method: ['GET', 'POST']
    }
})

app.use(cookieParser());

const corsOption = {
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
    origin: "http://localhost:3000", // frontend app url
};
app.use(cors(corsOption));
app.use("/storage", express.static("storage"));

const PORT = process.env.PORT || 5500;
// database connection
DbConnect();

app.use(
    express.json({
        limit: "8mb",
    })
);

app.use(router);

app.get("/", (req, res) => {
    res.send("<h1>WebRTC Api </h1>");
});

//Socket
const socketUserMapping = {}
io.on('connection', (socket) => {
    console.log('new Connection: ', socket.id);

    socket.on(ACTION.JOIN, (roomId, user) => {
        socketUserMapping[socket.id] = user;
    });

    // user mapping from user to room mapping 
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.ADD_PEER, {});
    });

    socket.emit(ACTIONS.ADD_PEER, {});
    socket.join(roomId);
})

server.listen(PORT, (req, res) => {
    console.log(` Listening on http://localhost:${PORT}`);
});
