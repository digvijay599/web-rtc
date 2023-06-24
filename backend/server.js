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
io.on('connection', (socket) => {

})

server.listen(PORT, (req, res) => {
    console.log(` Listening on http://localhost:${PORT}`);
});
