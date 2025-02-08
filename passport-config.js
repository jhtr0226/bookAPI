const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongoose = require("mongoose");
const User = require("./models/user");
const axios = require("axios");

const isRender = process.env.RENDER === "true";

const CALLBACK_URL = isRender
  ? "https://bookapi-5sj1.onrender.com/auth/github/callback" 
  : "http://localhost:3000/auth/github/callback";


  
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = new User({
          githubId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || "No public email",
          profilePicture: profile.photos?.[0]?.value || "",
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
