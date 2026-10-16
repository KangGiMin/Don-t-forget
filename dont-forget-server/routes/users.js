// 프론트엔드에서 로그인이나 유저 쪽으로 요청 보낼 시, userController가 받음

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireFirebaseAuth = require('../middleware/requireFirebaseAuth');

router.use(requireFirebaseAuth);
router.get('/users/me', userController.getMyProfile);
router.patch('/users/me', userController.updateMyProfile);
router.post('/contact', userController.contactAdmin);

module.exports = router;