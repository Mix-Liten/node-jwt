const router = require('express').Router();
const Post = require('../model/Post')
const {
  auth
} = require('./verifyToken');

// get all post
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

// get specific post
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

// create post
router.post('/', auth, async (req, res) => {
  // console.log(req.user);
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  });
  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

// update post
router.patch('/:postId', async (req, res) => {
  try {
    const updatedPost = await Post.updateOne({
      _id: req.params.postId
    }, {
      $set: {
        title: req.body.title,
        description: req.body.description
      }
    });
    res.json(updatedPost);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

// delete post
router.get('/:postId', async (req, res) => {
  try {
    const removedPost = await Post.remove({
      _id: req.params.postId
    });
    res.json(removedPost);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

module.exports = router;