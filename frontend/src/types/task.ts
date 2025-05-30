export interface Task {
  id: number;
  name: string;
  priority: TaskPriority;
  hours: number;
  engineer_id?: number;
  started_at?: Date;
  status: TaskStatus;
}

export enum TaskPriority {
  alta = "Alta",
  media = "Media",
  baixa = "Baixa",
}

export enum TaskStatus {
  pendente = "Pendente",
  em_andamento = "Em Andamento",
  concluida = "Concluida",
}
