const User = require("./models/userSchema"); 
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use(
        new LocalStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {  
                if (err) throw err; 
                if (!user) return done(null, false); 

                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) throw err; 
                    if (result) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
            })
        })
    )
    passport.serializeUser((user, cb) => {
        cb(null, user.id);  
    });

    passport.deserializeUser((id, cb) => {
        User.findOne({_id: id}, (err, user) => {
            const userInformation = {
                username: user.username
            };
            cb(err, userInformation);
        })
    })

    // passport.deserializeUser((id, done) => {
    //     User.findById(id, (err, user) => {
    //         done(err, user);
    //     });
    // });
    
    // passport.deserializeUser((id, cb) => {
    //     User.findById(id, (err, user) => {
    //         cb(err, { username: user.username });
    //     })
    // })

    // passport.serializeUser((user, done) => {
    //     done(null, user._id)
    // }); 

    // passport.deserializeUser((id, done) => {
    //     User.findById(id, (err, user) => { 
    //         done(err, user)
    //     })
    // })

}