const express = require('express');
const mongoose = require('mongoose'); 
const Joi = require('joi');
const app = express(); 
const cors = require('cors');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const passport = require("passport"); 
const session = require("express-session");
const cookieParser = require("cookie-parser");   
const passportLocal = require("passport-local").Strategy;
const bodyParser = require('body-parser');
const router = express.Router();

// app.use(bodyParser.urlencoded({ extended: true })); 
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
// })); 

// app.use(cookieParser(process.env.SESSION_SECRET));
// app.use(passport.initialize());
// app.use(passport.session());

require('dotenv/config');

const initializePassport = require("../passport-config");
initializePassport(passport);

const CheckIfLoggedOut = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.send("Logged in already! Cant register");
    } else {
        return next();
    }
}
  
const CheckIfLoggedIn= (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.send({isLoggedIn: true, id: req.user.id});
    } else {
        return next();
    }
} 

router.get('/:id', async(req, res) => {
    try {
        const userFind = await User.findById(req.params.id);
        res.send(userFind.itemList);
    } catch(err) {
        res.status(err);
    }
})

router.post('/register', CheckIfLoggedOut, async (req, res) => {
// router.post('/register', async (req, res) => {

    if (req.body.password2 !== req.body.password) {
        return res.send("Passwords do not match. Try Again");
    }

    const { error } = checkLoginInfoValid(req.body);

    if (error) return res.send(error.details[0].message);

    const usernameExists = await User.findOne({ username: req.body.username });

    if (usernameExists) return res.send("Username already assigned to a user");

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User ({
        // name: req.body.name, 
        username: req.body.username, 
        password: hashPassword
    })

    try {
        const savedUser = await newUser.save(); 
        res.send(true);
    } catch(err) {
        res.status(400).send("Error. Unable to register user");
    }
})

// router.post('/login', CheckIfLoggedIn, (req, res, next) => {
router.post('/login', (req, res, next) => {

    let userAuthenticated = true;

    const { error } = checkUserInfoValid(req.body);
    // console.log(req.body); 

    if (error) return res.send(error.details[0].message);
    // console.log("error", error); 

    passport.authenticate('local', {session: true}, (err, user, info) => {
        if (err) throw err; 
        if (!user) res.send("Incorrect username"); 
        else {
            req.login(user, err => {     
                if (err) throw err; 
                // console.log("User authenticated!");

                res.send({isLoggedIn: userAuthenticated, id: req.user.id});
            })
        }
    })(req, res, next);
})

router.delete('/logout', (req, res) => {
    console.log(req.isAuthenticated());
    req.session.destroy();
    req.logOut();
    // res.redirect('/');
})

// check logout function
router.get('/checkSession', (req, res) => {
    console.log("backedn req.user: ", req.user);
    res.send(req.isAuthenticated());
})
 
router.get('/userInformation', async (req, res) => {

    console.log("backedn req.user: ", req.user);
    try {
        const user = await User.find({ username: req.user.username });
        res.send(user);
    } catch(err) {
        res.status(err);
    } 
}) 
 
router.post('/updateUserList/:id', (req, res) => {
    // console.log(User.find({ username: req.user.username }));
    console.log(req.params.id);
    User.findById(req.params.id)
        .then((result) => { 
            console.log("From backend the list: ", result.itemList);
            console.log("from backend req.body: ", req.body);
            console.log(result)
            result.itemList = req.body; 
            result.save()
                .then(() => res.json("updated without drama!"))
                .catch(err => res.status(err).send("DRAMA!"))
        })
        .catch(err => res.status(err).send("DRAMA!"))
}) 

/*********************************************************************************************/

const checkUserInfoValid = (userInfo) => {
    const criteria = Joi.object({
        // name: Joi.string().required(), 
        username: Joi.string().required(),
        password: Joi.string().min(6)
    });

    return criteria.validate(userInfo);
}

const checkLoginInfoValid = (loginInfo) => {
    const criteria = Joi.object({
        // name: Joi.string().required(), 
        username: Joi.string().required(), 
        password: Joi.string().min(6), 
        password2: Joi.string().min(6)
    });

    return criteria.validate(loginInfo);
}

module.exports = router;