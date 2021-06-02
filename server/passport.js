const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const argon2 = require("argon2");

const db = require("./postgres");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await db.lookupUser(username);
      const userObject = rows[0];

      if (!userObject) {
        return done(null, false);
      }

      if (!(await argon2.verify(userObject.password, password))) {
        return done(null, false);
      }

      return done(null, userObject);
    } catch (err) {
      return done(err);
    }
  })
);

// Adds user object to the session
// Runs on login and signup, saves session to redis, deserialize below loads from redis
passport.serializeUser((user, cb) => {
  // Hmm what if I delete the prop instead...
  // user.password = "";
  delete user.password;
  // Hmm do I really need this to reach this point?
  delete user.p_key;
  cb(null, user);
});

// Takes user from session(in redis) and puts on request body
// Runs on refresh/request when session is valid
// Note: For now I'm just keeping some data on the redis session,
// another option (maybe better) is to only store the id then
// do a db lookup here to populate user object
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports = passport;
