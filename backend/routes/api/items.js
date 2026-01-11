const router = require("express").Router();
const mongoose = require("mongoose");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");
const auth = require("../auth");
const { sendEvent } = require("../../lib/event");

// Preload item objects on routes with ':item'
router.param("item", async (req, res, next, slug) => {
  try {
    const item = await Item.findOne({ slug }).populate("seller");
    if (!item) return res.sendStatus(404);
    req.item = item;
    return next();
  } catch (err) {
    return next(err);
  }
});

router.param("comment", async (req, res, next, id) => {
  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.sendStatus(404);
    req.comment = comment;
    return next();
  } catch (err) {
    return next(err);
  }
});

router.get("/", auth.optional, async (req, res, next) => {
  try {
    const query = {};
    const limit = typeof req.query.limit !== 'undefined' ? Number(req.query.limit) : 100;
    const offset = typeof req.query.offset !== 'undefined' ? Number(req.query.offset) : 0;

    if (typeof req.query.tag !== 'undefined') query.tagList = { $in: [req.query.tag] };

    const [seller, favoriter] = await Promise.all([
      req.query.seller ? User.findOne({ username: req.query.seller }) : null,
      req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
    ]);

    if (seller) query.seller = seller._id;

    if (favoriter) {
      query._id = { $in: favoriter.favorites };
    } else if (req.query.favorited) {
      query._id = { $in: [] };
    }

    const [items, itemsCount, user] = await Promise.all([
      Item.find(query).limit(limit).skip(offset).sort({ createdAt: 'desc' }).exec(),
      Item.countDocuments(query).exec(),
      req.payload ? User.findById(req.payload.id) : null
    ]);

    const itemsForUser = await Promise.all(
      items.map(async item => {
        item.seller = await User.findById(item.seller);
        return item.toJSONFor(user);
      })
    );

    return res.json({ items: itemsForUser, itemsCount });
  } catch (err) {
    return next(err);
  }
});

router.get('/feed', auth.required, async (req, res, next) => {
  try {
    const limit = typeof req.query.limit !== 'undefined' ? Number(req.query.limit) : 20;
    const offset = typeof req.query.offset !== 'undefined' ? Number(req.query.offset) : 0;

    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);

    const [items, itemsCount] = await Promise.all([
      Item.find({ seller: { $in: user.following } })
        .limit(limit)
        .skip(offset)
        .populate('seller')
        .exec(),
      Item.countDocuments({ seller: { $in: user.following } })
    ]);

    return res.json({ items: items.map(i => i.toJSONFor(user)), itemsCount });
  } catch (err) {
    return next(err);
  }
});

router.post('/', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);

    const item = new Item(req.body.item);
    item.seller = user;

    await item.save();
    sendEvent('item_created', { item: req.body.item });
    return res.json({ item: item.toJSONFor(user) });
  } catch (err) {
    return next(err);
  }
});

// return a item
router.get('/:item', auth.optional, async (req, res, next) => {
  try {
    const user = req.payload ? await User.findById(req.payload.id) : null;
    await req.item.populate('seller').execPopulate();
    return res.json({ item: req.item.toJSONFor(user) });
  } catch (err) {
    return next(err);
  }
});

// update item
router.put('/:item', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    if (req.item.seller._id.toString() !== req.payload.id.toString()) return res.sendStatus(403);

    const fields = ['title', 'description', 'image', 'tagList'];
    fields.forEach(field => {
      if (typeof req.body.item[field] !== 'undefined') req.item[field] = req.body.item[field];
    });

    const item = await req.item.save();
    return res.json({ item: item.toJSONFor(user) });
  } catch (err) {
    return next(err);
  }
});

// delete item
router.delete('/:item', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);

    if (req.item.seller._id.toString() === req.payload.id.toString()) {
      await req.item.remove();
      return res.sendStatus(204);
    }

    return res.sendStatus(403);
  } catch (err) {
    return next(err);
  }
});

// Favorite an item
router.post('/:item/favorite', auth.required, async (req, res, next) => {
  try {
    const itemId = req.item._id;
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);

    await user.favorite(itemId);
    const item = await req.item.updateFavoriteCount();
    return res.json({ item: item.toJSONFor(user) });
  } catch (err) {
    return next(err);
  }
});

// Unfavorite an item
router.delete('/:item/favorite', auth.required, async (req, res, next) => {
  try {
    const itemId = req.item._1d || req.item._id;
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);

    await user.unfavorite(itemId);
    const item = await req.item.updateFavoriteCount();
    return res.json({ item: item.toJSONFor(user) });
  } catch (err) {
    return next(err);
  }
});

// return an item's comments
router.get('/:item/comments', auth.optional, async (req, res, next) => {
  try {
    const user = req.payload ? await User.findById(req.payload.id) : null;
    await req.item
      .populate({ path: 'comments', populate: { path: 'seller' }, options: { sort: { createdAt: 'desc' } } })
      .execPopulate();

    return res.json({ comments: req.item.comments.map(c => c.toJSONFor(user)) });
  } catch (err) {
    return next(err);
  }
});

// create a new comment
router.post('/:item/comments', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);

    const comment = new Comment(req.body.comment);
    comment.item = req.item;
    comment.seller = user;

    await comment.save();
    req.item.comments = req.item.comments.concat([comment]);
    await req.item.save();
    return res.json({ comment: comment.toJSONFor(user) });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:item/comments/:comment', auth.required, async (req, res, next) => {
  try {
    req.item.comments.remove(req.comment._id);
    await req.item.save();
    await Comment.deleteOne({ _id: req.comment._id }).exec();
    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
