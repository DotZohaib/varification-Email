const express = require("ëxpress")


const productUser = (req, res, next) => {

    if (req.session.user) {
        next()
    } else {
        res.redirect("/login")
    }



}

module.exports = productUser;
