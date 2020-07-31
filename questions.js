const mainQuestion = {
    name: "action",
    type: "list",
    message: "Would you like to [VIEW], [ADD], [UPDATE] or [DELETE] departments, roles or employees? (CTRL+C to exit.)",
    choices: ["VIEW", "ADD", "UPDATE", "DELETE", "EXIT"]
}

const selectViewActions = {
    name: "action",
    type: "list",
    message: "Would you like to view [DEPARTMENTS], [ROLES] or [EMPLOYEES]?",
    choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "GO BACK."]
}

const selectUpdateActions = {
    name: "action",
    type: "list",
    message: "Would you like to update an employee's [ROLE] or [MANAGER]?",
    choices: ["EMPLOYEE ROLE", "EMPLOYEE MANAGER", "GO BACK."]
}

const selectDeleteActions = {
    name: "action",
    type: "list",
    message: "Would you like to delete a [DEPARTMENT], [ROLE] or [EMPLOYEE]?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "GO BACK."]
}

const selectViewEmployees = {
    name: "action",
    type: "list",
    message: "Would you like to view [ALL] employees or employees [BY MANAGER] ?",
    choices: ["ALL", "BY MANAGER", "GO BACK."]
}

const selectAddActions = {
    name: "action",
    type: "list",
    message: "Would you like to add a [DEPARTMENT], [ROLE] or [EMPLOYEE]?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "GO BACK."]
}

const addDepartment = {
    name: "name",
    type: "input",
    message: "What is the name of the new department?"
}

module.exports = {
    mainQuestion,
    selectViewActions,
    selectViewEmployees,
    selectAddActions,
    addDepartment,
    selectUpdateActions,
    selectDeleteActions
}