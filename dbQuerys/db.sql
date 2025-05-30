-- Tabla 'Rol'
CREATE TABLE role (
id INT PRIMARY KEY AUTO_INCREMENT,
roleName NVARCHAR(100) NOT NULL
);

-- Tabla 'User'
CREATE TABLE user (
id INT PRIMARY KEY AUTO_INCREMENT,
user_name NVARCHAR(100) NOT NULL,
email NVARCHAR(100) NOT NULL UNIQUE,
password NVARCHAR(100) NOT NULL,
role_id INT NOT NULL,
FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla 'Tutor'
CREATE TABLE tutor (
id INT PRIMARY KEY AUTO_INCREMENT,
tutor_name NVARCHAR(100) NOT NULL,
email NVARCHAR(150) NOT NULL UNIQUE,
phone NVARCHAR(15) NOT NULL,
department NVARCHAR(100) NOT NULL,
shift NVARCHAR(10) check (shift in ('matutino', 'vespertino')) not NULL,
status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) NOT null
);

-- Tabla 'Subject'
CREATE TABLE subject (
id INT PRIMARY key AUTO_INCREMENT,
subject_name NVARCHAR(100) NOT NULL,
department NVARCHAR(100) NOT NULL,
status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) NOT NULL
);

-- Tabla 'Tutor con materias'
CREATE TABLE tutor_subjects (
tutor_id INT NOT NULL,
subject_id INT NOT NULL,
PRIMARY KEY (tutor_id, subject_id),
FOREIGN KEY (tutor_id) REFERENCES tutor(id) ON DELETE cascade ON UPDATE CASCADE,
FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE cascade ON UPDATE CASCADE
);

-- Tabla 'Log'
CREATE TABLE log (
id INT PRIMARY KEY AUTO_INCREMENT,
student_name NVARCHAR(100) NOT NULL,
student_group NVARCHAR(50) NOT NULL,
tutor_id INT NOT NULL,
subject_id INT NOT NULL,
status ENUM('pending', 'accepted', 'cancelled') NOT NULL DEFAULT 'pending',
FOREIGN KEY (tutor_id) REFERENCES tutor(id),
FOREIGN KEY (subject_id) REFERENCES subject(id)
);

-- Tabla horarios

CREATE TABLE schedule (
id INT PRIMARY KEY AUTO_INCREMENT,
log_id INT NOT NULL,
day_of_week ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes') NOT NULL,
hour TIME NOT NULL,
FOREIGN KEY (log_id) REFERENCES log(id) on delete cascade
);

-- Dummy Data

insert into role (roleName) values ('superAdmin'), ('Admin');

INSERT INTO user (user_name, email, password, role_id) VALUES
('should be removed', 'login@login.com', '$2a$10$M2O3any2jY31bdGIjRuT4uEcL/QQk6kUM4Ex7QNDtwIiqcdzxHO.O', 1);


INSERT INTO tutor (tutor_name , email, phone, department, status, shift) VALUES
('John Doe', 'john.doe@example.com', '555-1234-1232', 'Mathematics', 'active', 'matutino'),
('Jane Smith', 'jane.smith@example.com', '555-5678-4421', 'Physics', 'inactive', 'vespertino'),
('Emily Davis', 'emily.davis@example.com', '555-8765-6121', 'Chemistry', 'active', 'vespertino');


INSERT INTO subject (subject_name , department, status) VALUES
('Calculus I', 'Mathematics', 'active'),
('Physics I', 'Physics','inactive'),
('Chemistry I', 'Chemistry','inactive');


INSERT INTO tutor_subjects (tutor_id , subject_id) VALUES
(1, 1),
(2, 1),
(3, 2),
(1, 3);

INSERT INTO log (student_name , student_group , tutor_id , subject_id , status) VALUES
('Alice Johnson', '24BM', 1, 1, 'accepted'),
('Bob Brown', '23BS', 2, 2, 'pending'),
('Charlie Green', '21AM', 3, 3, 'cancelled');

insert into schedule(log_id, day_of_week, `hour`) VALUES
(1, 'Lunes', '07:00:00'),
(2, 'Martes', '11:00:00'),
(3, 'Lunes', '12:00:00');