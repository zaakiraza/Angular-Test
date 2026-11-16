import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateTask, Task } from '../../core/models/task.model';
import { TaskApiService } from '../../core/services/task-api.service';

type TaskFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  private readonly taskApi = inject(TaskApiService);

  readonly tasks = signal<Task[]>([]);
  readonly filter = signal<TaskFilter>('all');
  readonly title = signal('');
  readonly description = signal('');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly remainingCount = computed(
    () => this.tasks().filter((task) => !task.completed).length,
  );
  readonly visibleTasks = computed(() => {
    const filter = this.filter();
    return this.tasks().filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set('');
    this.taskApi.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load tasks. Check that the API is running.');
        this.loading.set(false);
      },
    });
  }

  addTask(): void {
    const taskTitle = this.title().trim();
    if (!taskTitle || this.saving()) return;

    const task: CreateTask = {
      title: taskTitle,
      description: this.description().trim() || null,
    };

    this.saving.set(true);
    this.error.set('');
    this.taskApi.createTask(task).subscribe({
      next: (createdTask) => {
        this.tasks.update((tasks) => [createdTask, ...tasks]);
        this.title.set('');
        this.description.set('');
        this.saving.set(false);
      },
      error: () => {
        this.error.set('Could not add this task. Please try again.');
        this.saving.set(false);
      },
    });
  }

  toggleTask(task: Task): void {
    this.error.set('');
    this.taskApi.updateTask(task.id, { completed: !task.completed }).subscribe({
      next: (updatedTask) => this.replaceTask(updatedTask),
      error: () => this.error.set('Could not update this task. Please try again.'),
    });
  }

  deleteTask(task: Task): void {
    this.error.set('');
    this.taskApi.deleteTask(task.id).subscribe({
      next: () => this.tasks.update((tasks) => tasks.filter((item) => item.id !== task.id)),
      error: () => this.error.set('Could not delete this task. Please try again.'),
    });
  }

  setFilter(filter: TaskFilter): void {
    this.filter.set(filter);
  }

  private replaceTask(updatedTask: Task): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }
}
