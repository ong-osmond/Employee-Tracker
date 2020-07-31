/*jshint esversion: 6 */

const mysql = require("mysql");
const inquirer = require("inquirer");
const queries = require("./lib/queryDB");
const questions = require("./lib/questions");
const cTable = require("console.table");

// Initialise the connection object
let connectionSettings = {
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "employeesDB"
};

// Ask the user to enter database user and password info
function initialiseApp() {
    inquirer.prompt([questions.user,
            questions.password
        ])
        .then(function(answer) {
            connectionSettings.user = answer.user;
            connectionSettings.password = answer.password;
            let initialConnection = mysql.createConnection(connectionSettings);
            initialConnection.connect(function(err) {
                if (err) {
                    console.log(err.code);
                    initialConnection.end();
                    initialiseApp();
                } else {
                    console.log("Connected to the database succesfully.");
                    initialConnection.end();
                    start();
                }
            });
        })
};

// Create the connection information for the SQL database
function getConnection(connectionSettings) {
    return mysql.createConnection(connectionSettings);
}

// Go to the main menu
initialiseApp();

// Main menu which prompts the user for what action they should take
function start() {
    inquirer
        .prompt(questions.mainQuestion)
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
                case ("EXIT"):
                    return;
                default:
                    return "You have selected an invalid action.";
            }
        });
}

// Menu for VIEW action
function selectViewActions() {
    inquirer
        .prompt(questions.selectViewActions)
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
                case ("< GO BACK"):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

// View all departments
function viewDepartments() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveDepartmentsQuery, function(err, results) {
        if (err) throw err;
        console.log("");
        console.table(results);
        connection.end();
        start();
    });
}

// View all roles
function viewRoles() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveRolesQuery, function(err, results) {
        if (err) throw err;
        console.log("");
        console.table(results);
        connection.end();
        start();
    });
}

// Menu for viewing employees
function selectViewEmployees() {
    inquirer
        .prompt(questions.selectViewEmployees)
        .then(function(answer) {
            switch (answer.action) {
                case ("ALL"):
                    viewEmployees();
                    break;
                case ("BY MANAGER"):
                    viewEmployeesByManager();
                    break;
                case ("< GO BACK"):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

// View all employees
function viewEmployees() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
        if (err) throw err;
        console.log("");
        console.table(results);
        connection.end();
        start();
    });
}

// View employees by Manager
function viewEmployeesByManager() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveManagersQuery, function(err, results) {
        if (err) throw err; {
            if (typeof results !== 'undefined' && results.length > 0) {
                inquirer
                    .prompt([{
                        name: "manager_id",
                        type: "list",
                        choices: function() {
                            let choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choice = { name: `${results[i].manager_name}`, value: results[i].id };
                                choiceArray.push(choice);
                            }
                            return choiceArray;
                        },
                        message: "Which manager?"
                    }])
                    .then(function(answer) {
                        connection.query(`select employees.* from (${queries.retrieveEmployeesByManagersQuery}) as employees where employees.manager_id = ${answer.manager_id};`, function(err, results) {
                            if (err) throw err;
                            console.log("");
                            console.table(results);
                            connection.end();
                            start();
                        });
                    });
            } else {
                console.log("There are no managers.");
                connection.end();
                start();
            }
        }
    });
}

// Menu for ADD action
function selectAddActions() {
    inquirer
        .prompt(questions.selectAddActions)
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
                case ("< GO BACK"):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

// Add a department
function addDepartment() {
    const connection = getConnection(connectionSettings);
    inquirer
        .prompt(questions.addDepartment)
        .then(function(answer) {
            connection.query(`
            insert into department(name) value("${answer.name}")
            `, function(err, results) {
                if (err) throw err;
                console.log("Department inserted successfully.");
                connection.end();
                start();
            });
        });
}

// Add a role
function addRole() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveDepartmentsQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([questions.title,
                questions.salary,
                {
                    name: "department_id",
                    type: "list",
                    choices: function() {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choice = { name: results[i].name, value: results[i].id };
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
                });
            });
    });
}

// Add an employee
function addEmployee() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveRolesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([questions.firstName,
                questions.lastName,
                {
                    name: "role_id",
                    type: "list",
                    choices: function() {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choice = { name: `${results[i].title} (${results[i].department_name})`, value: results[i].id };
                            choiceArray.push(choice);
                        }
                        return choiceArray;
                    },
                    message: "What is the role of the new employee?"
                }
            ])
            .then(
                function(employee) {
                    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
                        if (err) throw err;
                        inquirer
                            .prompt([{
                                name: "manager_id",
                                type: "list",
                                choices: function() {
                                    let choiceArray = [];
                                    for (var i = 0; i < results.length; i++) {
                                        choice = { name: `${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id };
                                        choiceArray.push(choice);
                                    }
                                    choiceArray.push({ name: `No manager.`, value: null }); //No manager
                                    return choiceArray;
                                },
                                message: "Who is the new employee's manager?"
                            }])
                            .then(
                                function(manager) {
                                    connection.query(`insert into employee(first_name, last_name, role_id, manager_id) value("${employee.first_name}", "${employee.last_name}", ${employee.role_id}, ${manager.manager_id})
                            `, function(err, results) {
                                        if (err) throw err;
                                        console.log("Employee added successfully.");
                                        connection.end();
                                        start();
                                    });
                                });
                    });
                }
            );
    });
}

// Menu for UPDATE action
function selectUpdateActions() {
    inquirer
        .prompt(questions.selectUpdateActions)
        .then(function(answer) {
            switch (answer.action) {
                case ("EMPLOYEE ROLE"):
                    updateEmployeeRole();
                    break;
                case ("EMPLOYEE MANAGER"):
                    updateEmployeeManager();
                    break;
                case ("< GO BACK"):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

// Update employee's role
function updateEmployeeRole() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employee_id",
                type: "list",
                choices: function() {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id };
                        choiceArray.push(choice);
                    }
                    choiceArray.push("< GO BACK");
                    return choiceArray;
                },
                message: "Which employee requires a role update?"
            }])
            .then(function(employee) {
                if (employee.employee_id == "< GO BACK") {
                    connection.end();
                    selectUpdateActions();
                } else {
                    connection.query(queries.retrieveRolesQuery, function(err, results) {
                        if (err) throw err;
                        inquirer
                            .prompt([{
                                name: "role_id",
                                type: "list",
                                choices: function() {
                                    let choiceArray = [];
                                    for (var i = 0; i < results.length; i++) {
                                        choice = { name: `New role: ${results[i].title} (${results[i].department_name})`, value: results[i].id };
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
                                });
                            });
                    });
                }
            });
    });
}

// Update employee's manager
function updateEmployeeManager() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employee_id",
                type: "list",
                choices: function() {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id };
                        choiceArray.push(choice);
                    }
                    choiceArray.push("< GO BACK");
                    return choiceArray;
                },
                message: "Which employee requires a manager update?"
            }])
            .then(function(employee) {
                if (employee.employee_id == "< GO BACK") {
                    connection.end();
                    selectUpdateActions();
                } else {
                    connection.query(`select managers.* from (${queries.retrieveEmployeesQuery}) as managers where id <> ${employee.employee_id};`, function(err, results) {
                        if (err) throw err;
                        inquirer
                            .prompt([{
                                name: "manager_id",
                                type: "list",
                                choices: function() {
                                    let choiceArray = [];
                                    for (var i = 0; i < results.length; i++) {
                                        choice = { name: `New manager: ${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id };
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
                                });
                            });
                    });
                }
            });
    });
}

// Menu for DELETE action
function selectDeleteActions() {
    inquirer
        .prompt(questions.selectDeleteActions)
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
                case ("< GO BACK"):
                    start();
                    break;
                default:
                    return "You have selected an invalid choice.";
            }
        });
}

// Delete a department
function deleteDepartment() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveDepartmentsQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "department_id",
                type: "list",
                choices: function() {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].name}`, value: results[i].id };
                        choiceArray.push(choice);
                    }
                    choiceArray.push("< GO BACK");
                    return choiceArray;
                },
                message: "Which department record is to be deleted? (Note: You cannot remove a department that currently has employees.)"
            }]).then(function(answer) {
                if (answer == "< GO BACK") {
                    connection.end();
                    selectDeleteActions();
                } else {
                    connection.query(`Delete from department where id = ${answer.department_id}`, function(err, results) {
                        if (err) {
                            console.log(err.sqlMessage);
                            connection.end();
                            selectDeleteActions();
                        } else {
                            connection.end();
                            console.log("Department removed successfully.");
                            start();
                        }
                    });
                }
            });
    });
}

// Delete a role
function deleteRole() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveRolesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "role_id",
                type: "list",
                choices: function() {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].title} (${results[i].department_name})`, value: results[i].id };
                        choiceArray.push(choice);
                    }
                    choiceArray.push("< GO BACK");
                    return choiceArray;
                },
                message: "Which role record is to be deleted? (Note: You cannot remove a role that is currently assigned to an employee.)"
            }]).then(function(answer) {
                if (answer == "< GO BACK") {
                    connection.end();
                    selectDeleteActions();
                } else {
                    connection.query(`Delete from role where id = ${answer.role_id}`, function(err, results) {
                        if (err) {
                            console.log(err.sqlMessage);
                            connection.end();
                            selectDeleteActions();
                        } else {
                            connection.end();
                            console.log("Role removed successfully.");
                            start();
                        }
                    });
                }
            });
    });
}

// Delete an employee
function deleteEmployee() {
    const connection = getConnection(connectionSettings);
    connection.query(queries.retrieveEmployeesQuery, function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employee_id",
                type: "list",
                choices: function() {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choice = { name: `${results[i].first_name} ${results[i].last_name} (${results[i].department_name})`, value: results[i].id };
                        choiceArray.push(choice);
                    }
                    choiceArray.push("< GO BACK");
                    return choiceArray;
                },
                message: "Which employee record is to be deleted? (Note: You cannot remove a manager record with current staff members.)"
            }]).then(function(answer) {
                if (answer == "< GO BACK") {
                    connection.end();
                    selectDeleteActions();
                } else {
                    connection.query(`Delete from employee where id = ${answer.employee_id}`, function(err, results) {
                        if (err) {
                            console.log(err.sqlMessage);
                            connection.end();
                            selectDeleteActions();
                        } else {
                            connection.end();
                            console.log("Employee record removed successfully.");
                            start();
                        }
                    });
                }
            });
    });
}