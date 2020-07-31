DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

-- Create Department table
CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
) ENGINE = INNODB;

-- Create Role table with department_id referencing Department table ID
CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id int NOT NULL,
    INDEX dept_ind(department_id),
    FOREIGN KEY(department_id) REFERENCES department(id),
    PRIMARY KEY(id)
) ENGINE = INNODB;

-- Create Employee table with role_id referencing Role table ID and manager_id referencing another employee ID
CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    INDEX role_ind(role_id),
    FOREIGN KEY(role_id) REFERENCES role(id),
    INDEX manager_ind(manager_id),
    FOREIGN KEY(manager_id) REFERENCES employee(id),
    PRIMARY KEY(id)
) ENGINE = INNODB;

INSERT INTO department(name)
VALUES ("Dwarves"), ("Elves"), ("Gondor"), ("Hobbits"), ("Wizards")
;

INSERT INTO role(title, salary, department_id)
VALUES
    ("Archer", 80, (select id from department where name = "Elves")),
    ("Axeman", 80, (select id from department where name = "Dwarves")),
    ("Gardener", 49.99, (select id from department where name = "Hobbits")),
    ("King", 100, (select id from department where name = "Gondor")),
    ("Ranger", 90, (select id from department where name = "Gondor")),
    ("Ring-bearer", 100, (select id from department where name = "Hobbits")),
    ("Wizard", 100, (select id from department where name = "Wizards"))
;

select role.id, role.title, role.salary, role.department_id, department.name
from role
join department on role.department_id = department.id
order by role.title
;

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ("Frodo", "Baggins", (select id from role where title = "Ring-bearer"), null),
    ("Legolas", "Greenleaf", (select id from role where title = "Archer"), null),
    ("Aragorn", "Son of Arathorn", (select id from role where title = "Ranger"), null),
    ("Boromir", "Son of Denethor", (select id from role where title = "Ranger"), null),
    ("Gimli", "Son of Gloin", (select id from role where title = "Axeman"), null),
    ("Gandalf", "The Grey", (select id from role where title = "Wizard"), null)
;

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ("Merry", "Brandybuck", (select id from role where title = "Gardener"), 1),
    ("Samwise", "Gamgee", (select id from role where title = "Gardener"), 1),
    ("Pippin", "Took", (select id from role where title = "Gardener"), 1)
;

select employee.id, employee.first_name, employee.last_name, role.title, employee.manager_id, department.name department
from employee
join role on employee.role_id = role.id
join department on role.department_id = department.id
order by employee.id;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';