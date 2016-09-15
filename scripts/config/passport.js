var configuration = require('./config.json');
var userModule = require("../modules/users.js");
var connectionModule = require("../connection.js");
var UserModel = userModule.getUserModel();
var userLogged = undefined

function setupFBStrategy(app) {
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;

    // High level serialize/de-serialize configuration for passport
    passport.serializeUser(function(user, done) {
        console.log("serializando"+user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("desserializando user with id: "+id);
        done(null, userLogged);

    });

    // Facebook-specific
    passport.use(new FacebookStrategy(
        {
            clientID: configuration.facebookAuth.facebook_api_key,
            clientSecret: configuration.facebookAuth.facebook_api_secret,
            callbackURL: configuration.facebookAuth.callback_url,
            // Necessary for new version of Facebookcallback_url graph API
            profileFields: ['id', 'emails', 'name', 'gender']
        },
        function(accessToken, refreshToken, profile, done) {
            if (!profile.emails || !profile.emails.length) {
                return done('No emails associated with this account!');
            }

            // console.log(JSON.stringify(profile));


            UserModel.find({email:profile.emails[0].value},function(err, user){
                if(err) throw err;
                var data = {
                    name : profile.name.givenName,
                    email : profile.emails[0].value,
                    password : profile.id,
                    isFB : true,
                    gender: profile.gender,
                    picture : "http://graph.facebook.com/" + profile.id.toString() + '/picture?type=large'
                }
                console.log(JSON.stringify(user));
                if(user[0]!=undefined){
                    console.log("existed user");
                    userLogged = user[0];
                    done(err, user[0]);
                }else{
                    var newUser = new UserModel({
                        name: data.name,
                        email: data.email,
                        gender:data.gender,
                        password: data.password,
                        isFB: data.isFB,
                        picture: data.picture
                    });
                    console.log("Registering new user with data: "+JSON.stringify(newUser));
                    newUser.save(function(err, user){
                        var saved = false;
                        if(err){
                            console.log("User not saved "+user);
                            throw err;
                        }else{
                            saved = true;
                            console.log("User saved "+user);
                            userLogged = user;
                            done(err, user);
                        }
                    });
                }
            });
        }));

    // Express middlewares
    app.use(require('express-session')({
        secret: 'this is a secret',
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Express routes for auth
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/facebookLogged',
            failureRedirect: '/'
        })
    );

    app.get('/facebookLogged', function(req, res) {
        console.log("Log in with facebook has been successful");
        connectionModule.getSocket().emit('logInUserBack', userLogged);
    });

}

module.exports = setupFBStrategy;
