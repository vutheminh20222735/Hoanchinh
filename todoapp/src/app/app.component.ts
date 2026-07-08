import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  
  newTodoText = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'medium';
  
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  sortBy: 'createdAt' | 'priority' = 'createdAt';
  searchKeyword = '';
  
  editingTodoId: number | null = null;
  editingTodoText = '';

  loading = false;
  errorMessage = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  // ========== LOAD TODOS ==========
  loadTodos(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.todoService.getTodos().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.todos = response.data;
          this.applyFilters();
        } else {
          this.errorMessage = response.message || 'Không thể tải dữ liệu';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Không thể kết nối đến server!';
        console.error('Lỗi tải todos:', err);
      }
    });
  }

  // ========== ADD TODO ==========
  addTodo(): void {
    if (!this.newTodoText.trim()) return;

    this.loading = true;
    this.todoService.addTodo(this.newTodoText, this.newTodoPriority).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.newTodoText = '';
          this.loadTodos();
        } else {
          this.errorMessage = response.message || 'Không thể thêm todo';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Không thể thêm todo!';
        console.error('Lỗi thêm todo:', err);
      }
    });
  }

  // ========== DELETE TODO ==========
  deleteTodo(id: number): void {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;

    this.loading = true;
    this.todoService.deleteTodo(id).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.loadTodos();
        } else {
          this.errorMessage = response.message || 'Không thể xóa todo';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Không thể xóa todo!';
        console.error('Lỗi xóa todo:', err);
      }
    });
  }

  // ========== TOGGLE TODO ==========
  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    // Dùng PATCH để cập nhật một phần
    this.todoService.patchTodo(id, { completed: !todo.completed }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTodos();
        }
      },
      error: (err) => {
        this.errorMessage = 'Không thể cập nhật todo!';
        console.error('Lỗi toggle todo:', err);
      }
    });
  }

  // ========== START EDIT ==========
  startEdit(todo: Todo): void {
    this.editingTodoId = todo.id;
    this.editingTodoText = todo.text;
  }

  // ========== SAVE EDIT ==========
  saveEdit(): void {
    if (!this.editingTodoText.trim() || this.editingTodoId === null) return;

    this.todoService.patchTodo(this.editingTodoId, { text: this.editingTodoText }).subscribe({
      next: (response) => {
        if (response.success) {
          this.editingTodoId = null;
          this.editingTodoText = '';
          this.loadTodos();
        }
      },
      error: (err) => {
        this.errorMessage = 'Không thể cập nhật todo!';
        console.error('Lỗi sửa todo:', err);
      }
    });
  }

  // ========== CANCEL EDIT ==========
  cancelEdit(): void {
    this.editingTodoId = null;
    this.editingTodoText = '';
  }

  // ========== CLEAR COMPLETED ==========
  clearCompleted(): void {
    if (!confirm('Bạn có chắc muốn xóa tất cả công việc đã hoàn thành?')) return;

    this.todoService.clearCompleted().subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTodos();
        }
      },
      error: (err) => {
        this.errorMessage = 'Không thể xóa todos đã hoàn thành!';
        console.error('Lỗi clear completed:', err);
      }
    });
  }

  // ========== APPLY FILTERS ==========
  applyFilters(): void {
    let result = [...this.todos];

    // Tìm kiếm
    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase().trim();
      result = result.filter(todo =>
        todo.text.toLowerCase().includes(keyword)
      );
    }

    // Lọc theo status
    if (this.filterStatus === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (this.filterStatus === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // Sắp xếp
    if (this.sortBy === 'createdAt') {
      result.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    this.filteredTodos = result;
  }

  // ========== ON FILTER CHANGE ==========
  onFilterChange(): void {
    this.applyFilters();
  }

  // ========== GETTERS ==========
  get remainingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  get totalCount(): number {
    return this.todos.length;
  }

  get completedCount(): number {
    return this.totalCount - this.remainingCount;
  }
}