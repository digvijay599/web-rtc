require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes");
const DbConnect = require("./db");
const cors = require("cors");

const corsOption = {
    origin: ["http://localhost:3000"],
};

app.use(cors(corsOption));

const PORT = process.env.PORT || 5500;
DbConnect();
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
    res.send("<h1>WebRTC Api </h1>");
});

app.listen(PORT, (req, res) => {
    console.log(` Listening on http://localhost:${PORT}`);
});
