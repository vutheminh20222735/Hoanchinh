const db = require('../config/database');

class Todo {
  static getAll(callback) {
    db.all('SELECT * FROM todos ORDER BY createdAt DESC', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM todos WHERE id = ?', [id], callback);
  }

  static create(todo, callback) {
    const { text, priority = 'medium' } = todo;
    db.run(
      'INSERT INTO todos (text, priority) VALUES (?, ?)',
      [text, priority],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID, text, priority, completed: 0 });
        }
      }
    );
  }

  static update(id, todo, callback) {
    const { text, completed, priority } = todo;
    db.run(
      `UPDATE todos 
       SET text = COALESCE(?, text), 
           completed = COALESCE(?, completed), 
           priority = COALESCE(?, priority),
           updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [text, completed, priority, id],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id, ...todo });
        }
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM todos WHERE id = ?', [id], callback);
  }

  static deleteCompleted(callback) {
    db.run('DELETE FROM todos WHERE completed = 1', callback);
  }

  static getRemainingCount(callback) {
    db.get('SELECT COUNT(*) as count FROM todos WHERE completed = 0', callback);
  }

  static search(keyword, callback) {
    db.all(
      'SELECT * FROM todos WHERE text LIKE ? ORDER BY createdAt DESC',
      [`%${keyword}%`],
      callback
    );
  }
}

module.exports = Todo;