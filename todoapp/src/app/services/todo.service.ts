import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/todos';

  constructor(private http: HttpClient) {}

  // GET all
  getTodos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // GET by id
  getTodoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // POST create
  addTodo(text: string, priority: 'low' | 'medium' | 'high' = 'medium'): Observable<any> {
    return this.http.post(this.apiUrl, { text, priority });
  }

  // PUT update full
  updateTodoFull(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // PATCH update partial  ← THÊM PHƯƠNG THỨC NÀY
  patchTodo(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  // DELETE todo
  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // DELETE all completed
  clearCompleted(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/completed/all`);
  }

  // GET search
  searchTodos(keyword: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  // GET remaining count
  getRemainingCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/remaining-count`);
  }
}