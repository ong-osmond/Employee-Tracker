/*jshint esversion: 6 */

const retrieveDepartmentsQuery = `select 
department.*, budget.total_budget
from
department
left join
    (
    select 
    department.id,
    department.name department_name,
    sum(role.salary)  total_budget
    from employee
    join role on employee.role_id = role.id
    join department on role.department_id = department.id
    left join employee as manager on employee.manager_id = manager.id
    group by department.name
    ) budget on department.id = budget.id
order by department.name`;

const retrieveRolesQuery = `select role.id
, role.title
, role.salary
, role.department_id
, department.name department_name
from role
join department on role.department_id = department.id
order by role.title`;

const retrieveEmployeesQuery = `select employee.id
, employee.first_name
, employee.last_name
, role.title
, department.name department_name
, role.salary
, concat(manager.first_name," ",manager.last_name) as manager_name 
from employee
join role on employee.role_id = role.id
join department on role.department_id = department.id
left join employee as manager on employee.manager_id = manager.id
order by employee.last_name, employee.first_name`;

const retrieveManagersQuery = `select distinct manager.id
, concat(manager.first_name," ",manager.last_name) as manager_name
from employee
join employee as manager on employee.manager_id = manager.id
order by manager.last_name, employee.first_name`;

const retrieveEmployeesByManagersQuery = `select employee.id
, employee.first_name
, employee.last_name
, role.title
, department.name department_name
, role.salary
, concat(manager.first_name," ",manager.last_name) as manager_name
, employee.manager_id
from employee
join role on employee.role_id = role.id
join department on role.department_id = department.id
join employee as manager on employee.manager_id = manager.id
order by employee.last_name, employee.first_name`;

module.exports = {
    retrieveDepartmentsQuery,
    retrieveRolesQuery,
    retrieveEmployeesQuery,
    retrieveManagersQuery,
    retrieveEmployeesByManagersQuery
};