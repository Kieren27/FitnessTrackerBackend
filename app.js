require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((req, _res, next) => {
    console.log("___Body Logger START___");
    console.log("Body ", req.body);
    console.log("___Body Logger END___");

    next();
});

const apiRouter = require('./api');
app.use('/api', apiRouter);

app.use((_req, res, next) => {
    res.status(404).json({message: "Not found"});
});

app.use((err, _req, res, next) => {
    console.log(err);
    res.status(500).json({message: err.message});
});

module.exports = app;
