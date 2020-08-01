/*jshint esversion: 6 */

//Validate an input must be entered
const validateInputIsNotEmpty = (input) => {
    if (input !== '') {
        return true;
    } else return `Please enter a value.`;
};

//Validate a number must be entered
const validateNumber = (amount) => {
    var reg = /^\d+(?:\.\d{0,2})$/;
    if (reg.test(amount)) {
        return true;
    } else return `Please enter a valid amount (e.g. "19.99").`;
};

const user = {
    name: "user",
    type: "input",
    message: "Welcome to the Employee Tracker app. (Press CTRL+C at any time to exit.) \n Please enter the database username."
};

const password = {
    name: "password",
    type: "password",
    mask: "*",
    message: "Please enter the password."
};

const mainQuestion = {
    name: "action",
    type: "list",
    message: "Welcome to the Employee Tracker app. \n Would you like to [VIEW], [ADD], [UPDATE] or [DELETE] departments, roles or employees? \n (Press CTRL+C at any time to exit.)",
    choices: ["VIEW", "ADD", "UPDATE", "DELETE", "EXIT"]
};

const selectViewActions = {
    name: "action",
    type: "list",
    message: "Would you like to view [DEPARTMENTS], [ROLES] or [EMPLOYEES]?",
    choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "< GO BACK"]
};

const selectUpdateActions = {
    name: "action",
    type: "list",
    message: "Would you like to update an employee's [ROLE] or [MANAGER]?",
    choices: ["EMPLOYEE ROLE", "EMPLOYEE MANAGER", "< GO BACK"]
};

const selectDeleteActions = {
    name: "action",
    type: "list",
    message: "Would you like to delete a [DEPARTMENT], [ROLE] or [EMPLOYEE]?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "< GO BACK"]
};

const selectViewEmployees = {
    name: "action",
    type: "list",
    message: "Would you like to view [ALL] employees or employees [BY MANAGER] ?",
    choices: ["ALL", "BY MANAGER", "< GO BACK"]
};

const selectAddActions = {
    name: "action",
    type: "list",
    message: "Would you like to add a [DEPARTMENT], [ROLE] or [EMPLOYEE]?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "< GO BACK"]
};

const addDepartment = {
    name: "name",
    type: "input",
    message: "What is the name of the new department?",
    validate: validateInputIsNotEmpty
};

const title = {
    name: "title",
    type: "input",
    message: "What is the name of the new role?",
    validate: validateInputIsNotEmpty
};

const salary = {
    name: "salary",
    type: "input",
    message: "How much is the salary of the new role?",
    validate: validateNumber
};

const firstName = {
    name: "first_name",
    type: "input",
    message: "What is the first name of the new employee?",
    validate: validateInputIsNotEmpty
};

const lastName = {
    name: "last_name",
    type: "input",
    message: "What is the last name of the new employee?",
    validate: validateInputIsNotEmpty
};

module.exports = {
    user,
    password,
    mainQuestion,
    selectViewActions,
    selectViewEmployees,
    selectAddActions,
    addDepartment,
    selectUpdateActions,
    selectDeleteActions,
    title,
    salary,
    firstName,
    lastName
};