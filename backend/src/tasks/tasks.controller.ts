import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, UpdateTaskDto } from 'src/models/task.model';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAll();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number): Promise<Task | null> {
    return this.tasksService.getById(id);
  }

  @Post()
  async createTask(@Body() task: Task): Promise<Task> {
    return this.tasksService.create(task);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() task: UpdateTaskDto,
  ): Promise<Task | null> {
    return this.tasksService.update(id, task);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<void> {
    return this.tasksService.delete(id);
  }

  @Post('alocar')
  async alocarTasks(): Promise<void> {
    return this.tasksService.alocarTasks();
  }
}
