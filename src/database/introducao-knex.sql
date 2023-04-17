-- Active: 1681743405153@@127.0.0.1@3306

-- Tabelas já foram criadas
CREATE TABLE bands (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE songs (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    band_id TEXT NOT NULL,
    FOREIGN KEY (band_id) REFERENCES bands (id)
);

SELECT * FROM bands;

-- só um exemplo de uma query pra usar no knex
INSERT INTO songs (id, name, band_id)
VALUES
("s001", "musica numero 1", "b001");


SELECT *FROM bands
WHERE id = "";

UPDATE bands
SELECT name = ""
WHERE id = "";