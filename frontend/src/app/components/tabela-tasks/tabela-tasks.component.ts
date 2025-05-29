import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tabela-tasks',
  imports: [],
  templateUrl: './tabela-tasks.component.html',
  styleUrl: './tabela-tasks.component.css'
})
export class TabelaTasksComponent {
   tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getAll().subscribe(data => {
      this.tasks = data as any[];
    });
  }
}
