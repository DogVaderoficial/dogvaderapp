
CREATE TABLE tutores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT,
  senha TEXT
);
CREATE TABLE cachorros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  foto TEXT,
  tutor_id INTEGER,
  FOREIGN KEY (tutor_id) REFERENCES tutores(id)
);
