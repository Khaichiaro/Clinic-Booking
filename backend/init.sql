DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS gender;

CREATE TABLE gender (
    id SERIAL PRIMARY KEY,
    gender VARCHAR(10) NOT NULL
);

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(100),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    gender_id INTEGER REFERENCES gender(id)
);

INSERT INTO gender (gender) VALUES ('Male'), ('Female');

INSERT INTO "user" (first_name, last_name, password, email, phone_number, gender_id) VALUES
('Pongsakorn', 'In-on', '123456', 'pongsakorn@example.com', '0911111111', 1),
('In-on', 'Pongsakorn', 'abcdef', 'inon@example.com', '0922222222', 2),
('PongPongPong', 'Sarakorn', 'letmein', 'pong@example.com', '0933333333', 1),
('B6507787', 'PongPongPong', 'password', 'b6507787@example.com', '0944444444', 1);
