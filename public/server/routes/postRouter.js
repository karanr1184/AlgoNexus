const express = require('express');
const postControllers = require('../controllers/postControllers')
const router = express.Router();

router.route('/').get(postControllers.getAllPosts).post(postControllers.createNewPost);

router.route('/DP').get(postControllers.getAllDP).post(postControllers.createNewDP);

router.route('/Look').get(postControllers.getAllLook).post(postControllers.createNewLook);

router.route('/FIFO').get(postControllers.getAllFIFO).post(postControllers.createNewFIFO);
// router.route('/:id').get(postControllers.getPostById)

module.exports = router;