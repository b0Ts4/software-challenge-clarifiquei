import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Engineer } from 'src/models/engineer.model';

@Injectable()
export class EngineersService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {}

  async getAll(): Promise<Engineer[]> {
    const { rows } = await this.pool.query(
      `SELECT 
      e.id, e.name, e.max_hours, e.eficiency,
      COALESCE(
        json_agg(
          json_build_object(
            'id', t.id,
            'engineer_id', t.engineer_id,
            'name', t.name,
            'hours', t.hours,
            'priority', t.priority,
            'status', t.status,
            'started_at', t.started_at
          )
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS tasks
    FROM engineers e
    LEFT JOIN tasks t ON t.engineer_id = e.id
    GROUP BY e.id`,
    );
    return rows;
  }

  async getById(id: number): Promise<Engineer | null> {
    const { rows } = await this.pool.query(
      `SELECT 
        e.id, e.name, e.max_hours, e.eficiency,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'engineer_id', t.engineer_id,
              'name', t.name,
              'hours', t.hours,
              'priority', t.priority,
              'status', t.status,
              'started_at', t.started_at
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tasks
      FROM engineers e
      LEFT JOIN tasks t ON t.engineer_id = e.id
      WHERE e.id = $1
      GROUP BY e.id;`,
      [id],
    );
    return rows[0] || null;
  }

  async create(engineer: Engineer): Promise<Engineer> {
    const { name, max_hours, eficiency: eficiency } = engineer;
    const { rows } = await this.pool.query(
      'INSERT INTO engineers (name, max_hours, eficiency) VALUES ($1, $2, $3) RETURNING *',
      [name, max_hours, eficiency],
    );
    return rows[0];
  }

  async update(id: number, engineer: Engineer): Promise<Engineer | null> {
    const { name, max_hours, eficiency: eficiency } = engineer;
    const { rows } = await this.pool.query(
      'UPDATE engineers SET name = $1, max_hours = $2, eficiency = $3 WHERE id = $4 RETURNING *',
      [name, max_hours, eficiency, id],
    );
    return rows[0] || null;
  }

  async delete(id: number): Promise<void> {
    await this.pool.query('DELETE FROM engineers WHERE id = $1', [id]);
  }
}
