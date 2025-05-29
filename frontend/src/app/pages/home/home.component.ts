import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { EngineerService } from '../../services/engineer.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks: any;
  engineers: any;

  constructor(private taskService: TaskService, private engineerService: EngineerService) {}


  getEngineers() {
    this.engineerService.getAll().subscribe((data) => {
      this.engineers = data;
    })
  }

  getTasks() {
    this.taskService.getAll().subscribe((data) => {
      this.tasks = data;
    })
  }


alocarTarefas() {
  this.taskService.alocarTarefas().subscribe(() => {
    this.getEngineers();
    this.getTasks();
  });
}
}
