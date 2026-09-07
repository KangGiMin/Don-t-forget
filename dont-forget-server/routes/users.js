// 프론트엔드에서 로그인이나 유저 쪽으로 요청 보낼 시, userController가 받음

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 프론트의 요청 경로와 주방장의 요리 기술(함수)을 연결!
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/find-id', userController.findId);
router.post('/reset-password', userController.resetPassword);

router.put('/users/:id', userController.updateProfile);
router.get('/users/:id', userController.getUserInfo);

router.post('/contact', userController.contactAdmin);

module.exports = router;