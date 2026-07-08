const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// ========== CÁC ROUTES ==========

// [GET] - Lấy tất cả todos
router.get('/', todoController.getAllTodos);

// [GET] - Tìm kiếm todos
router.get('/search', todoController.searchTodos);

// [GET] - Lấy số lượng còn lại
router.get('/remaining-count', todoController.getRemainingCount);

// [GET] - Lấy todo theo id
router.get('/:id', todoController.getTodoById);

// [POST] - Tạo todo mới
router.post('/', todoController.createTodo);

// [PUT] - Cập nhật toàn bộ todo
router.put('/:id', todoController.updateTodo);

// [PATCH] - Cập nhật một phần todo
router.patch('/:id', todoController.patchTodo);

// [DELETE] - Xóa todo
router.delete('/:id', todoController.deleteTodo);

// [DELETE] - Xóa tất cả todos đã hoàn thành
router.delete('/completed/all', todoController.deleteCompletedTodos);

module.exports = router;