const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

const { main_menu, new_department, new_employee, new_role } = require("./src/questions");

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'employee_tracker'
  },
  console.log(`Connected to the employee_tracker database.`)
);

function viewEmployee() {
  const sql = `SELECT e.id, e.first_name AS first_name, e.last_name AS last_name, roles.title, departments.department, roles.salary, manager.first_name AS manager
    FROM employees e
    LEFT JOIN employees manager ON e.manager_id=manager.id
    INNER JOIN roles ON roles.id=e.role_id
    INNER JOIN departments ON departments.id=roles.department_id
    ORDER BY e.id ASC`;

  db.query(sql, async (err, result) => {
    if(err){
      console.log(err.message);
      return;
    }
    await console.table(result);
    menu();
  });
}

function addEmployee() {
  inquirer.prompt().then((response) => {

  });
}

function updateRole() {
  inquirer.prompt().then((response) => {

  });
}

function viewRole() {
  const sql = `SELECT roles.id, title, departments.department, roles.salary FROM roles
  INNER JOIN departments ON roles.department_id=departments.id
  ORDER BY roles.id ASC`;

  db.query(sql, async (err, result) => {
    if(err){
      console.log(err.message);
      return;
    }
    await console.table(result);
    menu();
  });
}

function addRole() {
  inquirer.prompt(new_role).then((response) => {
    const sql = `INSERT INTO roles (title, salary, department_id)
    VALUE ("${response.role_name}", "${response.salary}", "${response.department_role}")`;

    db.query(sql, async (err, result) => {
      if(err){
        console.log(err.message);
        return;
      }
      new_employee[2].choices.push(response.role_name);
      await console.log(`Added ${response.role_name} to the database.`);
      menu();
    });
  });
}

function viewDepartment() {
  const sql = `SELECT * FROM departments
  ORDER BY departments.id ASC`;

  db.query(sql, async (err, result) => {
    if(err){
      console.log(err.message);
      return;
    }
    await console.table(result);
    menu();
  });
}

function addDepartment() {
  inquirer.prompt(new_department).then((response) => {
    const sql = `INSERT INTO departments (department)
    VALUE ("${response.department_name}")`;

    db.query(sql, async (err, result) => {
      if(err){
        console.log(err.message);
        return;
      }
      new_role[2].choices.push(response.department_name);
      await console.log(`Added ${response.department_name} to the database.`);
      menu();
    });
  });
}

function menu(){
  inquirer.prompt(main_menu).then((response) => {
    if(response.user_choice == 'View All Employees'){
      viewEmployee();
    }else if(response.user_choice == 'Add Employee'){
      addEmployee();
    }else if(response.user_choice == 'Update Employee Role'){
      updateRole();
    }else if(response.user_choice == 'View All Roles'){
      viewRole();
    }else if(response.user_choice == 'Add Role'){
      addRole();
    }else if(response.user_choice == 'View All Departments'){
      viewDepartment();
    }else if(response.user_choice == 'Add Department'){
      addDepartment();
    }else {
      console.log('Exiting...')
      process.exit();
    }
  });  
}

function preEditQuestion() {
  const sql_roles = `SELECT title FROM roles ORDER BY title ASC`;
  
  db.query(sql_roles, async (err, result) => {
    if(err){
      console.log(err.message);
      return;
    }
    
    for(let role of result) {
      new_employee[2].choices.push(role.title);
    }
    //console.log(new_employee[2].choices);
  });

  const sql_departments = `SELECT department FROM departments ORDER BY department ASC`;
  
  db.query(sql_departments, async (err, result) => {
    if(err){
      console.log(err.message);
      return;
    }
    
    for(let department of result) {
      new_role[2].choices.push(department.department);
    }
    //console.log(new_role[2].choices);
    await menu();
  });
}

preEditQuestion();