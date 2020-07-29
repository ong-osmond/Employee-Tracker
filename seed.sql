DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

-- Create Department table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=INNODB;

-- Create Role table with department_id referencing Department table ID
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id int NOT NULL,
  INDEX dept_ind (department_id),
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE,
  PRIMARY KEY (id)
) ENGINE=INNODB;

-- Create Employee table with role_id referencing Role table ID and manager_id referencing another employee ID
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  INDEX role_ind (role_id),
    FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE CASCADE,
  INDEX manager_ind (manager_id),
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE CASCADE,
  PRIMARY KEY (id)
) ENGINE=INNODB;

INSERT INTO department (name)
VALUES ("Gondor"), ("Rohan"), ("Mordor");

INSERT INTO role (title, salary, department_id)
VALUES 
("Ranger",99.99,(select id from department where name = "Gondor")),
("Archer",89.99,(select id from department where name = "Gondor")),
("Axeman",89.99,(select id from department where name = "Gondor")),
("Wizard",99.99,(select id from department where name = "Rohan")),
("Hobbit",79.99,(select id from department where name = "Rohan")),
("Ring-bearer",99.99,(select id from department where name = "Mordor")),
("Hobbit",89.99,(select id from department where name = "Mordor"))
;

select role.id, role.title, role.salary, role.department_id, department.name
from role
join department on role.department_id = department.id
order by role.title
;


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Aragorn","Son of Arathorn",(select id from role where title = "Ranger"),null),
("Frodo","Baggins",(select id from role where title = "Ring-bearer"),null),
("Gandalf","The White",(select id from role where title = "Wizard"),null)
;

select employee.id, employee.first_name, employee.last_name, role.title, employee.manager_id, department.name
from employee
join role on employee.role_id = role.id
join department on role.department_id = department.id
order by employee.last_name, employee.first_name
;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';