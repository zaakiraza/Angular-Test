import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTask, Task, UpdateTask } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly http = inject(HttpClient);
  private readonly tasksUrl = 'http://localhost:8000/api/v1/tasks';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl);
  }

  createTask(task: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, task);
  }

  updateTask(id: number, changes: UpdateTask): Observable<Task> {
    return this.http.patch<Task>(`${this.tasksUrl}/${id}`, changes);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.tasksUrl}/${id}`);
  }
}
