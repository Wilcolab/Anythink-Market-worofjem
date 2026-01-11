const router = require("express").Router();
const mongoose = require("mongoose");
const CommentModel = mongoose.model("Comment");

module.exports = router;
// Hey GitHub Copilot, please implement the following routes for comments:
// 1. GET /api/comments - Retrieve all comments
// 2. POST /api/comments - Create a new comment
// 3. GET /api/comments/:id - Retrieve a specific comment by ID
// 4. PUT /api/comments/:id - Update a specific comment by ID
// 5. DELETE /api/comments/:id - Delete a specific comment by ID

// 1. GET /api/comments - Retrieve all comments
router.get("/", async (req, res) => {
    try {
        const comments = await CommentModel.find();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. POST /api/comments - Create a new comment
router.post("/", async (req, res) => {
    try {
        const newComment = new CommentModel(req.body);
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Test route
router.get("/test", (req, res) => {
    res.json({ message: "Comments route is working!" });
});

// 3. GET /api/comments/:id - Retrieve a specific comment by ID
router.get('/:id', async (req, res) => {
    try {
        const comment = await CommentModel.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. PUT /api/comments/:id - Update a specific comment by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedComment) return res.status(404).json({ message: 'Comment not found' });
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. DELETE /api/comments/:id - Delete a specific comment by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedComment = await CommentModel.findByIdAndDelete(req.params.id);
        if (!deletedComment) return res.status(404).json({ message: 'Comment not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
