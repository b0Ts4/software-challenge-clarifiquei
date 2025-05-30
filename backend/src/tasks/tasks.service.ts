import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Task, UpdateTaskDto } from 'src/models/task.model';

@Injectable()
export class TasksService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {}

  async getAll(): Promise<Task[]> {
    const { rows } = await this.pool.query('SELECT * FROM tasks');
    return rows;
  }

  async getById(id: number): Promise<Task | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id],
    );
    return rows[0] || null;
  }

  async create(task: Task): Promise<Task> {
    const { name, priority, hours, engineer_id, started_at } = task;
    const { rows } = await this.pool.query(
      'INSERT INTO tasks (name, priority, hours, engineer_id, started_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, priority, hours, engineer_id, started_at],
    );
    return rows[0];
  }

  async update(id: number, task: UpdateTaskDto): Promise<Task | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(task)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    values.push(id); // o último é sempre o id

    const query = `
    UPDATE tasks
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING *;
  `;

    const { rows } = await this.pool.query(query, values);
    return rows[0] || null;
  }

  async delete(id: number): Promise<void> {
    await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  async alocarTasks(): Promise<void> {
    const { rows: allEngineers } = await this.pool.query(`
      SELECT e.*
      FROM engineers e
      WHERE NOT EXISTS (
        SELECT *
        FROM tasks t
        WHERE t.engineer_id = e.id
          AND t.status IN ('Pendente', 'Em Andamento')
      );
   
    `);

    const engineers = [...allEngineers];

    engineers.sort((a, b) => b.max_hours - a.max_hours);

    if (engineers.length === 0) return;

    const { rows: tasks }: { rows: Task[] } = await this.pool.query(`
      SELECT * FROM tasks
      WHERE engineer_id IS NULL
    `);

    const prioridadePeso = (p: string) =>
      p === 'Alta' ? 1 : p === 'Média' || p === 'Media' ? 2 : 3;

    tasks.sort((a, b) => {
      const prioridadeDiff =
        prioridadePeso(a.priority) - prioridadePeso(b.priority);
      if (prioridadeDiff !== 0) return prioridadeDiff;
      return b.hours - a.hours;
    });

    for (const task of tasks) {
      for (let i = 0; i < engineers.length; i++) {
        const engineer = engineers[i];
        const cargaAtual = await this.getLoadEngineer(engineer.id);

        const tempoComEficiência = task.hours / (1 + engineer.eficiency);

        if (cargaAtual + tempoComEficiência <= engineer.max_hours) {
          const { rows } = await this.pool.query(
            `UPDATE tasks SET engineer_id = $1 WHERE id = $2 RETURNING *`,
            [engineer.id, task.id],
          );
          console.log(`rows::: `, rows);
          engineers.splice(i, 1);
          break;
        }
      }
    }
  }

  private async getLoadEngineer(engineerId: number): Promise<number> {
    const { rows } = await this.pool.query(
      `
      SELECT COALESCE(SUM(hours / (1 + e.eficiency)), 0) AS load
      FROM tasks t
      JOIN engineers e ON t.engineer_id = e.id
      WHERE t.engineer_id = $1 AND t.status IN ('Pendente', 'Em Andamento')
    `,
      [engineerId],
    );

    return parseFloat(rows[0].load);
  }
}
