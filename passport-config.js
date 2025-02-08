const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongoose = require("mongoose");
const User = require("./models/user");
const axios = require("axios");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = new User({
            githubId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            profilePicture: profile.photos?.[0]?.value || "",
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("Deserializing user:", user);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
