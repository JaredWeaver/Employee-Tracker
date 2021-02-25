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

SELECT employee.id, employee.first_name, employee.last_name, roles.title, CONCAT(manager.first_name, " ", manager.last_name) manager
 FROM employee 
 LEFT JOIN roles 
 ON employee.role_id=roles.id
 LEFT JOIN employee manager 
 ON manager.manager_id=employee.id;

SELECT roles.id, roles.title, roles.salary, department.department_name
 FROM roles 
 LEFT JOIN department
 ON roles.department_id = department.id;
 