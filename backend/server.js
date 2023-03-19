require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes");
const DbConnect = require("./db");

const PORT = process.env.PORT || 5500;
DbConnect();
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
    res.send("Hello from express");
});

app.listen(PORT, (req, res) => {
    console.log(` Listening on http:\\localhost:${PORT}`);
});
