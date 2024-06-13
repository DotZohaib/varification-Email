let exports = require("module.exports");
let express = require("express");
let router = express.Router();
let path = require("path");
let fs = require("fs");
let ejs = require("ejs");


router.get("/", (req, res) => {
    res.render("index");
});




module.exports = Home;

