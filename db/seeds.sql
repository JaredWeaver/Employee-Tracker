DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department(
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles(
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER
);

CREATE TABLE employee(
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);

--STARTER DATA--

INSERT INTO department(department_name)
VALUES("ENGINEERING"), ("SALES"), ("MARKETING"), ("HUMAN RESOURCES");

INSERT INTO roles(title, salary, department_id)
VALUES  ('ENGINEER', 100000, 1), 
        ('SENIOR ENGINEER', 100000, 1),
        ('ACCOUNT EXECUTIVE', 55000, 2),
        ('SALES MANAGER', 75000, 2),
        ('MARKETING COORDINATOR', 55000, 3),
        ('MARKETING MANAGER', 40000, 3),
        ('OFFICE MANAGER', 80000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ('NICK', 'FOLES', 1, NULL),
        ('BRIAN', 'DAWKINS', 2, NULL);
        