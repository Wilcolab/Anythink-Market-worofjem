const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require('../auth');

// Preload user profile on routes with ':username'
router.param('username', async (req, res, next, username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return res.sendStatus(404);
    req.profile = user;
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get('/:username', auth.optional, async (req, res, next) => {
  try {
    if (req.payload) {
      const user = await User.findById(req.payload.id);
      return res.json({ profile: req.profile.toProfileJSONFor(user || false) });
    }
    return res.json({ profile: req.profile.toProfileJSONFor(false) });
  } catch (err) {
    return next(err);
  }
});

router.post('/:username/follow', auth.required, async (req, res, next) => {
  try {
    const profileId = req.profile._id;
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);
    await user.follow(profileId);
    return res.json({ profile: req.profile.toProfileJSONFor(user) });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:username/follow', auth.required, async (req, res, next) => {
  try {
    const profileId = req.profile._id;
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);
    await user.unfollow(profileId);
    return res.json({ profile: req.profile.toProfileJSONFor(user) });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
