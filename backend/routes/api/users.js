const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const User = mongoose.model("User");
const auth = require("../auth");
const { sendEvent } = require("../../lib/event");

router.get("/user", auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);
    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    return next(err);
  }
});

router.put("/user", auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);

    // only update fields that were actually passed
    const updates = ['username', 'email', 'bio', 'image'];
    updates.forEach(field => {
      if (typeof req.body.user[field] !== 'undefined') user[field] = req.body.user[field];
    });
    if (typeof req.body.user.password !== 'undefined') user.setPassword(req.body.user.password);

    await user.save();
    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    return next(err);
  }
});

router.post("/users/login", (req, res, next) => {
  if (!req.body.user || !req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

router.post("/users", async (req, res, next) => {
  try {
    const user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    await user.save();
    sendEvent('user_created', { username: req.body.user.username });
    return res.json({ user: user.toAuthJSON() });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
