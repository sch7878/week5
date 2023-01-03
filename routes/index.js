const express = require('express');
const postsRouter = require('./posts');
const userRouter = require('./user');
const commentsRouter = require('./comments');
const router = express.Router();

router.use('/', [userRouter,postsRouter,commentsRouter])


module.exports = router;