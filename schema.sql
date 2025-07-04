CREATE TABLE engineers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  max_hours INTEGER NOT NULL,
  eficiency NUMERIC DEFAULT 1
);

CREATE TYPE priority_enum AS ENUM ('Alta', 'Media', 'Baixa');
CREATE TYPE status_enum AS ENUM ('Pendente', 'Em Andamento', 'Concluida');

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  hours INTEGER NOT NULL,
  started_at TIMESTAMP,
  priority priority_enum NOT NULL,
  status status_enum DEFAULT 'Pendente',
  engineer_id INTEGER,
  foreign key (engineer_id) references engineers(id)
);

