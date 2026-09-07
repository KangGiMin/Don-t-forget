const express = require('express');
const router = express.Router(); // 라우터 기능 켜기
const todoController = require('../controllers/todoController'); // controller 호출

// 경로와 주방장님의 요리 기술을 짝지어주기만 하면 끝!
router.post('/', todoController.createTodo);        // 할 일 추가
router.get('/', todoController.getTodos);    // 할 일 조회
router.put('/:id', todoController.updateTodo);      // 할 일 수정
router.delete('/:id', todoController.deleteTodo);   // 할 일 삭제

module.exports = router; // 외부(server.js)에서 쓸 수 있게 내보내기