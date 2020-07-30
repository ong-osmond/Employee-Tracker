const mysql = require("mysql");
const inquirer = require("inquirer");
const queries = require("./queryDB");
//const cTable = require("console.table");

// create the connection information for the sql database
function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "employeesDB"
    });
}

// Go to the main menu
start();

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to [VIEW], [ADD], [UPDATE] or [DELETE] departments, roles or employees? (CTRL+C to exit.)",
            choices: ["VIEW", "ADD", "UPDATE", "DELETE"]
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
                case ("DELETE"):
                    selectDeleteActions();
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
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "Go back."]
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
                    selectViewEmployees();
                    break;
                case ("Go back."):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

function viewDepartments() {
    const connection = getConnection();
    connection.query(queries.retrieveDepartmentsQuery, function(err, results) {
        if (err) throw err;
        console.table(results);
        connection.end();
        start();
    });
}

function viewRoles() {
    const connection = getConnection();
    connection.query(queries.retrieveRolesQuery, function(err, results) {
        if (err) throw err;
        console.table(results);
        connection.end();
        start();
    });
}

function selectViewEmployees() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to view [ALL] employees or employees [BY MANAGER] ?",
            choices: ["ALL", "BY MANAGER", "Go back."]
        })
        .then(function(answer) {
            switch (answer.action) {
                case ("ALL"):
                    viewEmployees();
                    break;
                case ("BY MANAGER"):
                    viewEmployeesByManager();
                    break;
                case ("Go back"):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

function viewEmployees() {
    const connection = getConnection();
    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
        if (err) throw err;
        console.table(results);
        connection.end();
        start();
    });
}

function viewEmployeesByManager() {
    const connection = getConnection();
    connection.query(queries.retrieveManagersQuery, function(err, results) {
        if (err) throw err; {
            if (typeof results !== 'undefined' && results.length > 0) {
                inquirer
                    .prompt([{
                        name: "manager_id",
                        type: "list",
                        choices: function() {
                            var choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choice = { name: `${results[i].manager_name} (${results[i].department_name})`, value: results[i].id }
                                choiceArray.push(choice);
                            }
                            return choiceArray;
                        },
                        message: "Which manager?"
                    }])
                    .then(function(answer) {
                        connection.query(`select employees.* from (${queries.retrieveEmployeesByManagersQuery}) as employees where employees.manager_id = ${answer.manager_id};`, function(err, results) {
                            if (err) throw err;
                            console.table(results);
                            connection.end();
                            start();
                        })
                    })
            } else {
                console.log("There are no managers.");
                connection.end();
                start();
            }
        }
    })
}

function selectAddActions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to add a [DEPARTMENT], [ROLE] or [EMPLOYEE]?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "Go back."]
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
                case ("Go back."):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

function addDepartment() {
    const connection = getConnection();
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the new department?"
        })
        .then(function(answer) {
            connection.query(`
            insert into department(name) value("${answer.name}")
            `, function(err, results) {
                if (err) throw err;
                console.log("Department inserted successfully.");
                connection.end();
                start();
            })
        })
}

function addRole() {
    const connection = getConnection();
    connection.query(queries.retrieveDepartmentsQuery, function(err, results) {
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
                connection.query(`
            insert into role(title, salary, department_id) value("${answer.title}", ${answer.salary}, ${answer.department_id})
            `, function(err, results) {
                    if (err) throw err;
                    console.log("Role inserted successfully.");
                    connection.end();
                    start();
                })
            })
    })
}


function addEmployee() {
    const connection = getConnection();
    connection.query(queries.retrieveRolesQuery, function(err, results) {
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
                connection.query(`insert into employee(first_name, last_name, role_id) value("${answer.first_name}", "${answer.last_name}", ${answer.role_id})
            `, function(err, results) {
                    if (err) throw err;
                    console.log("Employee added successfully.");
                    connection.end();
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
            message: "Would you like to update an employee's [ROLE] or [MANAGER]?",
            choices: ["ROLE", "MANAGER", "Go back."]
        })
        .then(function(answer) {
            switch (answer.action) {
                case ("ROLE"):
                    updateEmployeeRole();
                    break;
                case ("MANAGER"):
                    updateEmployeeManager();
                    break;
                case ("Go back."):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

function updateEmployeeRole() {
    const connection = getConnection();
    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employee_id",
                type: "list",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id }
                        choiceArray.push(choice);
                    }
                    return choiceArray;
                },
                message: "Which employee requires a role update?"
            }])
            .then(function(employee) {
                connection.query(queries.retrieveRolesQuery, function(err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([{
                            name: "role_id",
                            type: "list",
                            choices: function() {
                                var choiceArray = [];
                                for (var i = 0; i < results.length; i++) {
                                    choice = { name: `New role: ${results[i].title} (${results[i].department_name})`, value: results[i].id }
                                    choiceArray.push(choice);
                                }
                                return choiceArray;
                            },
                            message: "What is the employee's new role?"
                        }])
                        .then(function(role) {
                            connection.query(`Update employee set role_id = ${role.role_id} where id = ${employee.employee_id}`, function(err, results) {
                                if (err) throw err;
                                connection.end();
                                console.log("Employee updated successfully.");
                                start();
                            })
                        })
                })
            })
    })
}

function updateEmployeeManager() {
    const connection = getConnection();
    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employee_id",
                type: "list",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id }
                        choiceArray.push(choice);
                    }
                    return choiceArray;
                },
                message: "Which employee requires a manager update?"
            }])
            .then(function(employee) {
                connection.query(`select managers.* from (${queries.retrieveEmployeesQuery}) as managers where id <> ${employee.employee_id};`, function(err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([{
                            name: "manager_id",
                            type: "list",
                            choices: function() {
                                var choiceArray = [];
                                for (var i = 0; i < results.length; i++) {
                                    choice = { name: `New manager: ${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id }
                                    choiceArray.push(choice);
                                }
                                choiceArray.push({ name: `No manager.`, value: null }); //No manager
                                return choiceArray;
                            },
                            message: "Who is the new manager?"
                        }])
                        .then(function(manager) {
                            connection.query(`Update employee set manager_id = ${manager.manager_id} where id = ${employee.employee_id}`, function(err, results) {
                                if (err) throw err;
                                connection.end();
                                console.log("Employee updated successfully.");
                                start();
                            })
                        })
                })
            })
    })
}

function selectDeleteActions() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to delete a [DEPARTMENT], [ROLE] or [EMPLOYEE]?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "Go back."]
        })
        .then(function(answer) {
            switch (answer.action) {
                case ("DEPARTMENT"):
                    deleteDepartment();
                    break;
                case ("ROLE"):
                    deleteRole();
                    break;
                case ("EMPLOYEE"):
                    deleteEmployee();
                    break;
                case ("Go back."):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

function deleteDepartment() {
    const connection = getConnection();
    connection.query(queries.retrieveDepartmentsQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "department_id",
                type: "list",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].name}`, value: results[i].id }
                        choiceArray.push(choice);
                    }
                    return choiceArray;
                },
                message: "Which department record is to be deleted? (Note: You cannot remove a department that currently has employees.)"
            }]).then(function(answer) {
                connection.query(`Delete from department where id = ${answer.department_id}`, function(err, results) {
                    if (err) throw err;
                    connection.end();
                    console.log("Department removed successfully.");
                    start();
                })
            })
    })
}

function deleteRole() {
    const connection = getConnection();
    connection.query(queries.retrieveRolesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
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
                message: "Which role record is to be deleted? (Note: You cannot remove a role that is currently assigned to an employee.)"
            }]).then(function(answer) {
                connection.query(`Delete from role where id = ${answer.role_id}`, function(err, results) {
                    if (err) throw err;
                    connection.end();
                    console.log("Role removed successfully.");
                    start();
                })
            })
    })
}

function deleteEmployee() {
    const connection = getConnection();
    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employee_id",
                type: "list",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id }
                        choiceArray.push(choice);
                    }
                    return choiceArray;
                },
                message: "Which employee record is to be deleted? (Note: You cannot remove a manager record with current staff members.)"
            }]).then(function(answer) {
                connection.query(`Delete from employee where id = ${answer.employee_id}`, function(err, results) {
                    if (err) throw err;
                    connection.end();
                    console.log("Employee record removed successfully.");
                    start();
                })
            })
    })
}