const Todo = require('../models/Todo');

// ========== GET - Lấy tất cả todos ==========
exports.getAllTodos = (req, res) => {
  Todo.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  });
};

// ========== GET - Lấy todo theo id ==========
exports.getTodoById = (req, res) => {
  const { id } = req.params;

  Todo.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay todo'
      });
    }
    res.json({
      success: true,
      data: row
    });
  });
};

// ========== POST - Tạo todo mới ==========
exports.createTodo = (req, res) => {
  const { text, priority } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Text la bat buoc'
    });
  }

  Todo.create({ text, priority }, (err, todo) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    res.status(201).json({
      success: true,
      message: 'Tao todo thanh cong',
      data: todo
    });
  });
};

// ========== PUT - Cập nhật toàn bộ todo ==========
exports.updateTodo = (req, res) => {
  const { id } = req.params;
  const { text, completed, priority } = req.body;

  // Kiểm tra todo có tồn tại không
  Todo.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay todo'
      });
    }

    // PUT yêu cầu tất cả fields đều có
    if (text === undefined || completed === undefined || priority === undefined) {
      return res.status(400).json({
        success: false,
        message: 'PUT yeu cau tat ca cac truong: text, completed, priority'
      });
    }

    Todo.update(id, { text, completed, priority }, (err, updatedTodo) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Loi server',
          error: err.message
        });
      }
      res.json({
        success: true,
        message: 'Cap nhat thanh cong',
        data: updatedTodo
      });
    });
  });
};

// ========== PATCH - Cập nhật một phần todo ==========
exports.patchTodo = (req, res) => {
  const { id } = req.params;
  const { text, completed, priority } = req.body;

  // Kiểm tra todo có tồn tại không
  Todo.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay todo'
      });
    }

    // PATCH chỉ cần gửi những field cần update
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Khong co du lieu de cap nhat'
      });
    }

    Todo.update(id, updateData, (err, updatedTodo) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Loi server',
          error: err.message
        });
      }
      res.json({
        success: true,
        message: 'Cap nhat thanh cong',
        data: updatedTodo
      });
    });
  });
};

// ========== DELETE - Xóa todo ==========
exports.deleteTodo = (req, res) => {
  const { id } = req.params;

  Todo.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay todo'
      });
    }

    Todo.delete(id, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Loi server',
          error: err.message
        });
      }
      res.json({
        success: true,
        message: 'Xoa todo thanh cong'
      });
    });
  });
};

// ========== DELETE - Xóa tất cả todos đã hoàn thành ==========
exports.deleteCompletedTodos = (req, res) => {
  Todo.deleteCompleted((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    res.json({
      success: true,
      message: 'Xoa tat ca todos da hoan thanh thanh cong'
    });
  });
};

// ========== GET - Lấy số lượng todos còn lại ==========
exports.getRemainingCount = (req, res) => {
  Todo.getRemainingCount((err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    res.json({
      success: true,
      data: { count: row.count }
    });
  });
};

// ========== GET - Tìm kiếm todos ==========
exports.searchTodos = (req, res) => {
  const { keyword } = req.query;

  if (!keyword || keyword.trim() === '') {
    return exports.getAllTodos(req, res);
  }

  Todo.search(keyword.trim(), (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Loi server',
        error: err.message
      });
    }
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  });
};