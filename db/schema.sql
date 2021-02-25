
INSERT INTO department(department_name)
VALUES("EXECUTIVE"), ("ENGINEERING"), ("SALES"), ("MARKETING"), ("HUMAN RESOURCES");

INSERT INTO roles(title, salary, department_id)
VALUES  
('CEO', 400000, 1), 
('CTO', 200000, 1), 
('CFO', 200000, 1), 
('ENGINEER', 100000, 2),
('SENIOR ENGINEER', 150000, 2),
('ACCOUNT EXECUTIVE', 55000, 3),
('SALES MANAGER', 75000, 3),
('MARKETING COORDINATOR', 55000, 4),
('MARKETING MANAGER', 40000, 4),
('OFFICE MANAGER', 80000, 5);

INSERT INTO employee(first_name, last_name, role_id)
values 
("SUSAN", "SMITH", 1);


SELECT employee.id, employee.first_name, employee.last_name, roles.title, CONCAT(manager.first_name, " ", manager.last_name) manager
 FROM employee 
 LEFT JOIN roles 
 ON employee.role_id=roles.id
 LEFT JOIN employee manager 
 ON manager.id=employee.id;

SELECT roles.id, roles.title, roles.salary, department.department_name
 FROM roles 
 LEFT JOIN department
 ON roles.department_id = department.id;
 