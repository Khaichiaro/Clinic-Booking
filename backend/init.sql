-- ลบตารางเก่า ถ้ามีอยู่แล้ว
DROP TABLE IF EXISTS appointment CASCADE;
DROP TABLE IF EXISTS doctor CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS gender CASCADE;
DROP TABLE IF EXISTS status CASCADE;
DROP TABLE IF EXISTS service_type CASCADE;

-- ตาราง gender
CREATE TABLE gender (
    id SERIAL PRIMARY KEY,
    gender VARCHAR(10) NOT NULL
);

-- ตาราง user
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(100),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    weight FLOAT,
    height FLOAT,
    age INTEGER,
    gender_id INTEGER REFERENCES gender(id)
);

-- ตาราง doctor
CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    password VARCHAR(100),
    gender_id INTEGER REFERENCES gender(id)
);

-- ตาราง doctor_schedule (เพิ่มใหม่)
CREATE TABLE doctor_schedule (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- ตาราง status
CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50)
);

-- ตาราง service_type
CREATE TABLE service_type (
    id SERIAL PRIMARY KEY,
    service_type VARCHAR(100)
);

-- ตาราง appointment
CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,
    appointment_time TIME,
    appointment_date DATE,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    servicetype_id INTEGER REFERENCES service_type(id),
    status_id INTEGER REFERENCES status(id),
    doctor_id INTEGER REFERENCES doctor(id)
);

-- ------------------------------------
-- Mock Data

-- gender
INSERT INTO gender (gender) VALUES
('Male'),
('Female'),
('LGBTQ+');

-- user
INSERT INTO "user" 
(first_name, last_name, password, email, phone_number, gender_id, weight, height, age) 
VALUES
('Pongsakorn', 'In-on', '123456', 'pongsakorn@gmail.com', '0911111111', 1, 65.0, 185, 22),
('In-on', 'Pongsakorn', 'abcdef', 'inon@example.com', '0922222222', 2, 55.5, 160, 21),
('PongPongPong', 'Sarakorn', 'letmein', 'pong@example.com', '0933333333', 1, 70.2, 180, 24),
('B6507787', 'PongPongPong', 'password', 'b6507787@example.com', '0944444444', 1, 61.8, 170, 23);


-- doctor
INSERT INTO doctor (first_name, last_name, phone_number, email, password, gender_id) VALUES
('Dr. Pong', 'In-on', '0999999999', 'pong@clinic.com', 'securepass', 2),
('Dr. John', 'Doe', '0823456789', 'john.doe@clinic.com', '12345678', 1);

-- หมอคนที่ 1 (Dr. Pong In-on)
INSERT INTO doctor_schedule (doctor_id, work_date, start_time, end_time) VALUES
(1, '2025-05-20', '08:00', '12:00'),
(1, '2025-05-21', '13:00', '17:00'),
(1, '2025-05-22', '08:00', '12:00'),
(1, '2025-05-23', '08:00', '12:00'),
(1, '2025-05-24', '13:00', '17:00'),
(1, '2025-05-25', '08:00', '12:00'),
(1, '2025-05-26', '13:00', '17:00');

-- หมอคนที่ 2 (Dr. John Doe)
INSERT INTO doctor_schedule (doctor_id, work_date, start_time, end_time) VALUES
(2, '2025-05-20', '10:00', '14:00'),
(2, '2025-05-21', '09:00', '12:00'),
(2, '2025-05-23', '13:00', '18:00'),
(2, '2025-05-24', '09:00', '12:00'),
(2, '2025-05-25', '10:00', '14:00'),
(2, '2025-05-26', '09:00', '13:00'),
(2, '2025-05-27', '13:00', '18:00');



-- status
INSERT INTO status (status) VALUES
('Pending'),
('Confirmed'),
('Completed'),
('Cancelled');

-- service_type

INSERT INTO service_type (service_type) VALUES
('Tooth Extraction'), ('Filling'),
('Orthodontics'), ('Root Canal Treatment'), ('Veneers'), ('Crowns'),
('Scaling');


-- appointment
INSERT INTO appointment (appointment_time, appointment_date, user_id, servicetype_id, status_id, doctor_id) VALUES
('09:00', '2025-05-20', 1, 1, 1, 1),
('10:30', '2025-05-21', 2, 2, 2, 2),
('13:00', '2025-05-22', 3, 3, 1, 1),
('14:30', '2025-05-23', 4, 4, 3, 2);
