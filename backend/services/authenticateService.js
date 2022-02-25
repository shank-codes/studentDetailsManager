require('dotenv').config();

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const User = require('../models/studentModel')

// If you are using only passport without passport-local-mongoose the local strategy can be quite different 
// i.e.) you will have to write code to compare passwords and all. Here just this 2 lines are enough

passport.use(new LocalStrategy({usernameField: 'studentNumber'},User.authenticate()))

//this is the way to serialize and deserialize with passport-local-mongoose plugin
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) => {                                      //only user id will be passed
    return jwt.sign(user,process.env.SECRET,{expiresIn: '24h'})
}

const options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET;

exports.JWTPassport = passport.use(new JWTStrategy(options,
    (Jwt_payload, done) => {
        console.log("JWT_PAYLOAD", Jwt_payload);
        console.log('reached here 4')
        User.findOne({ _id: Jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

//exports.verifyUser = passport.authenticate('jwt', { session: false });