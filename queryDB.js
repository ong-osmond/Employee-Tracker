const mysql = require("mysql");

// create the connection information for the sql database
const getConnection = () => {
    return mysql.createConnection({
        host: "localhost",
        // Your port; if not 3306
        port: 3306,
        // Your username
        user: "root",
        // Your password
        password: "root",
        database: "employeesDB"
    });
}

const viewDepartments = () => {
    console.log("Viewing departments...");
    const connection = getConnection();
    const queryResponse = connection.query(`select * from department`);
    console.table(queryResponse);
    connection.end();
}

const viewRoles = () => {
    const connection = getConnection();
    const queryResponse = connection.query(`select role.id
                                                , role.title
                                                , role.salary
                                                , role.department_id
                                                , department.name department
                                                from role
                                                join department on role.department_id = department.id
                                                order by role.title`);
    console.table(queryResponse);
    connection.end();
}


const viewEmployees = () => {
    const connection = getConnection();
    const queryResponse = connection.query(`select employee.id
    , employee.first_name
    , employee.last_name
    , role.title
    , role.salary
    , employee.manager_id
    , department.name department
    from employee
    join role on employee.role_id = role.id
    join department on role.department_id = department.id
    order by employee.last_name, employee.first_name`);
    console.table(queryResponse);
    connection.end();
}

module.exports = {
    viewDepartments,
    viewRoles,
    viewEmployees
}