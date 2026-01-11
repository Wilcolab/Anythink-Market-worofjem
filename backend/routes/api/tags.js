const router = require('express').Router();
const mongoose = require('mongoose');
const Item = mongoose.model('Item');

// return a list of tags
router.get('/', async (req, res, next) => {
  try {
    const tags = await Item.find().distinct('tagList');
    return res.json({ tags });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
