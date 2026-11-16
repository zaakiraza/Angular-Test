import { Component } from '@angular/core';
import { TaskListComponent } from './features/tasks/task-list.component';

@Component({
  imports: [TaskListComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
