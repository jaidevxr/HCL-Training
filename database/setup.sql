CREATE TABLE IF NOT EXISTS tasks (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  done       BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO tasks (title) VALUES ('Learn React');
INSERT INTO tasks (title) VALUES ('Learn Node.js');
INSERT INTO tasks (title) VALUES ('Deploy on AWS EC2');


SELECT * FROM tasks;
