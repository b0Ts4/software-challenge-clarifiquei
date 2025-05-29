import { Pool } from 'pg';
import { ConfigService } from '../config/config.service';

const config = new ConfigService();

export const databaseProvider = {
  provide: 'PG_CONNECTION',
  useFactory: async () => {
    const pool = new Pool({
      host: config.get('DB_HOST'),
      port: config.getNumber('DB_PORT'),
      user: config.get('DB_USER'),
      password: config.get('DB_PASS'),
      database: config.get('DB_NAME'),
    });
    return pool;
  },
};
