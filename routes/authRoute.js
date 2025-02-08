const express = require("express");
const passport = require("passport");
const router = express.Router();

// Redirect to GitHub OAuth login
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

// Handle GitHub OAuth callback
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    console.log("GitHub authentication successful! Redirecting to dashboard...");
    res.redirect("/dashboard");
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

module.exports = router;
