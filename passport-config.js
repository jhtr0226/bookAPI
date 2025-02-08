const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongoose = require("mongoose");
const User = require("./models/user");
const axios = require("axios"); // Ensure axios is installed

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
        let email = "No email provided";

        
        const emailResponse = await axios.get("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (emailResponse.data.length > 0) {
          email = emailResponse.data.find(e => e.verified && e.primary)?.email || email;
        }

        
        let user = await User.findOne({ email: email });

        if (!user) {
          user = new User({
            githubId: profile.id,
            displayName: profile.displayName || profile.username,
            email: email,
            profilePicture: profile.photos?.[0]?.value || null,
          });
          await user.save();
        } else {
          
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        console.error("GitHub OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
