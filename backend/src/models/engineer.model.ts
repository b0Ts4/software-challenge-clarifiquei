import { Task } from './task.model';

export interface Engineer {
  id: number;
  name: string;
  max_hours: number;
  eficiency?: number;
  tasks: Task[];
}
