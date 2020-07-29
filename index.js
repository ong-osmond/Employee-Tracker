const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "employeesDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to [VIEW], [ADD] or [UPDATE] departments, roles or employees? (CTRL+C to exit.)",
            choices: ["VIEW", "ADD", "UPDATE"]
        })
        .then(function(answer) {
            switch (answer.action) {
                case ("VIEW"):
                    selectViewActions();
                    break;
                case ("ADD"):
                    selectAddActions();
                    break;
                case ("UPDATE"):
                    selectUpdateActions();
                    break;
                default:
                    return "You have selected an invalid action.";
            }
        });
}


function selectViewActions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to view [DEPARTMENTS], [ROLES] or [EMPLOYEES]?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES"]
        })
        .then(function(answer) {
            switch (answer.action) {
                case ("DEPARTMENTS"):
                    viewDepartments();
                    break;
                case ("ROLES"):
                    viewRoles();
                    break;
                case ("EMPLOYEES"):
                    viewEmployees();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

function viewDepartments() {
    connection.query(`select * from department`, function(err, results) {
        if (err) throw err;
        console.table(results);
        start();
    });
}

function viewRoles() {
    connection.query(`select role.id
                        , role.title
                        , role.salary
                        , role.department_id
                        , department.name department
                        from role
                        join department on role.department_id = department.id
                        order by role.title`, function(err, results) {
        if (err) throw err;
        console.table(results);
        start();
    });
}

function viewEmployees() {
    connection.query(`select employee.id
                    , employee.first_name
                    , employee.last_name
                    , role.title
                    , role.salary
                    , employee.manager_id
                    , department.name department
                    from employee
                    join role on employee.role_id = role.id
                    join department on role.department_id = department.id
                    order by employee.last_name, employee.first_name`, function(err, results) {
        if (err) throw err;
        console.table(results);
        start();
    });
}

function selectAddActions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to add a [DEPARTMENT], [ROLE] or [EMPLOYEE]?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
        })
        .then(function(answer) {
            switch (answer.action) {
                case ("DEPARTMENT"):
                    addDepartment();
                    break;
                case ("ROLE"):
                    addRole();
                    break;
                case ("EMPLOYEE"):
                    addEmployee();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

function addDepartment() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the new department?"
        })
        .then(function(answer) {
            connection.query(`insert into department (name) value ("${answer.name}")`, function(err, results) {
                if (err) throw err;
                console.log("Department inserted successfully.");
                start();
            })
        })
}

function addRole() {
    connection.query(`select * from department`, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "title",
                    type: "input",
                    message: "What is the name of the new role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "How much is the salary of the new role?"
                },
                {
                    name: "department_id",
                    type: "list",
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choice = { name: results[i].name, value: results[i].id }
                            choiceArray.push(choice);
                        }
                        return choiceArray;
                    },
                    message: "Which department does the the new role belong to?"
                }
            ])
            .then(function(answer) {
                connection.query(`insert into role (title, salary, department_id) value ("${answer.title}",${answer.salary},${answer.department_id})`, function(err, results) {
                    if (err) throw err;
                    console.log("Role inserted successfully.");
                    start();
                })
            })
    })
}


function addEmployee() {
    connection.query(`select role.id, role.title, role.salary, role.department_id, department.name department_name
                        from role
                        join department on role.department_id = department.id
                        order by role.title`, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "first_name",
                    type: "input",
                    message: "What is the first name of the new employee?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the last name of the new employee?"
                },
                {
                    name: "role_id",
                    type: "list",
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choice = { name: `${results[i].title} (${results[i].department_name})`, value: results[i].id }
                            choiceArray.push(choice);
                        }
                        return choiceArray;
                    },
                    message: "What is the role of the new employee?"
                }
            ])
            .then(function(answer) {
                connection.query(`insert into employee (first_name, last_name, role_id) value ("${answer.first_name}","${answer.last_name}",${answer.role_id})`, function(err, results) {
                    if (err) throw err;
                    console.log("Employee added successfully.");
                    start();
                })
            })
    })
}


function selectUpdateActions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to update a [DEPARTMENT], [ROLE] or [EMPLOYEE]?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
        })
        .then(function(answer) {
            switch (answer.action) {
                case ("DEPARTMENT"):
                    updateDepartment();
                    break;
                case ("ROLE"):
                    updateRole();
                    break;
                case ("EMPLOYEE"):
                    updateEmployee();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}