var configuration = require('./config.json');

function setupAuth(app) {
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;

    // High level serialize/de-serialize configuration for passport
    passport.serializeUser(function(user, done) {
        console.log("serializando"+user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("serializando"+user);
        User.
            findOne({ _id : id }).
            exec(done);
    });

    // Facebook-specific
    passport.use(new FacebookStrategy(
        {
            clientID: configuration.facebookAuth.facebook_api_key,
            clientSecret: configuration.facebookAuth.facebook_api_secret,
            callbackURL: configuration.facebookAuth.callback_url,
            // Necessary for new version of Facebookcallback_url graph API
            profileFields: ['id', 'emails', 'name']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("user with email"+profile.emails[0].value);
            if (!profile.emails || !profile.emails.length) {
                return done('No emails associated with this account!');
            }

            console.log("user with email"+profile.emails[0].value);
            done(profile);
//            User.findOneAndUpdate(
//                { 'data.oauth': profile.id },
//                {
//                    $set: {
//                        'profile.username': profile.emails[0].value,
//                        'profile.picture': 'http://graph.facebook.com/' +
//                            profile.id.toString() + '/picture?type=large'
//                    }
//                },
//                { 'new': true, upsert: true, runValidators: true },
//                function(error, user) {
//                    done(error, user);
//                });
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
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

}

module.exports = setupAuth;
