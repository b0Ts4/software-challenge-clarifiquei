import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Task } from 'src/models/task.model';

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

  async update(id: number, task: Task): Promise<Task | null> {
    const { name, priority, hours, engineer_id, started_at, status } = task;
    const { rows } = await this.pool.query(
      'UPDATE tasks SET name = $1, priority = $2, hours = $3, engineer_id = $4, started_at = $5, status = $6 WHERE id = $7 RETURNING *',
      [name, priority, hours, engineer_id, started_at, status, id],
    );
    return rows[0] || null;
  }

  async delete(id: number): Promise<void> {
    await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  async alocarTasks(): Promise<void> {
    const { rows: engineers } = await this.pool.query(`
      SELECT * FROM engineers
      WHERE id NOT IN (
        SELECT engineer_id
        FROM tasks
        WHERE status IN ('Pendente', 'Em andamento')
      )
    `);

    if (engineers.length === 0) return;

    const { rows: tasks } = await this.pool.query(`
      SELECT * FROM tasks
      WHERE engineer_id IS NULL
      ORDER BY
        CASE priority
          WHEN 'Alta' THEN 1
          WHEN 'Média' THEN 2
          WHEN 'Baixa' THEN 3
        END
    `);

    for (const task of tasks) {
      for (const engineer of engineers) {
        const cargaAtual = await this.getLoadEngineer(engineer.id);

        const tempoComEficiência = task.tempo / (1 + engineer.eficiency);

        if (cargaAtual + tempoComEficiência <= engineer.max_hours) {
          await this.pool.query(
            `UPDATE tasks SET engineer_id = $1 WHERE id = $2`,
            [engineer.id, task.id],
          );
          break;
        }
      }
    }
  }

  private async getLoadEngineer(engineerId: number): Promise<number> {
    const { rows } = await this.pool.query(
      `
      SELECT COALESCE(SUM(tempo / (1 + e.eficiency)), 0) AS load
      FROM tasks t
      JOIN engineers e ON t.engineer_id = e.id
      WHERE t.engineer_id = $1 AND t.status IN ('Pendente', 'Em andamento')
    `,
      [engineerId],
    );

    return parseFloat(rows[0].load);
  }
}
