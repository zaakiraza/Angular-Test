import { Component, computed, inject } from '@angular/core';
import { TaskListComponent } from './features/tasks/task-list.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  imports: [TaskListComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly themeService = inject(ThemeService);
  readonly themeToggleLabel = computed(() =>
    this.themeService.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );
}
