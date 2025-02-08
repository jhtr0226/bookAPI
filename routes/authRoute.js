const express = require("express");
const passport = require("passport");

const router = express.Router();

// GitHub OAuth Login Route
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth Callback Route
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    req.session.user = req.user; // Store session
    res.redirect("/dashboard"); // Redirect after login
  }
);

// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
