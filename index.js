const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

const {
  main_menu,
  new_department,
  new_employee,
  new_role,
  update_role
} = require("./src/questions");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root1234",
    database: "employee_tracker",
  },
  console.log(`Connected to the employee_tracker database.`)
);

function viewEmployee() {
  const sql = `SELECT e.id, e.first_name AS first_name, e.last_name AS last_name, roles.title, departments.department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employees e
    LEFT JOIN employees manager ON e.manager_id=manager.id
    INNER JOIN roles ON roles.id=e.role_id
    INNER JOIN departments ON departments.id=roles.department_id
    ORDER BY e.id ASC`;

  db.query(sql, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    await console.table(result);
    menu();
  });
}

function insertEmployee(first, last, role, manager_id) {
  let sql;
  if(manager_id === "None"){
    sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ( "${first}", "${last}", ${role}, NULL)`;
  } else{
    sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ( "${first}", "${last}", ${role}, "${manager_id}")`;
  }
  
  db.query(sql, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    if(manager_id === "None"){
      new_employee[3].choices.push(`${first} ${last}`);
    }
    menu();
  });
}

async function queryEmployee(response, role_id) {
  if (response.manager !== "None") {
    const sql_e = `SELECT id FROM employees WHERE CONCAT(first_name, " ", last_name) = ?`;
    db.query(sql_e, response.manager, async (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      await insertEmployee(
        response.first_name,
        response.last_name,
        role_id,
        result[0].id
      );
    });
  } else {
    await insertEmployee(response.first_name, response.last_name, role_id, "None");
  }
}

function addEmployee() {
  inquirer.prompt(new_employee).then((response) => {
    const sql = `SELECT roles.id FROM roles WHERE roles.title = ?`;
    db.query(sql, response.employee_role, async (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      await queryEmployee(response, result[0].id);
    });
  });
}

function update(result, name) {
  const sql = `UPDATE employees JOIN roles USING (id)
  SET employees.role_id = ?
  WHERE CONCAT(employees.first_name, " ", employees.last_name) = ?`;

  db.query(sql, [result[0].id, name], async (err, result) => {
    if(err) {
      console.log(err.message);
      return;
    }
    console.log("Updated role of employee.");
    menu();
  });
}

function updateRole() {
  inquirer.prompt(update_role).then((response) => {
    const sql = `SELECT roles.id FROM roles WHERE roles.title = ?`;

  db.query(sql, response.role, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    update(result, response.employee_name);
  });
  });
}

function viewRole() {
  const sql = `SELECT roles.id, title, departments.department, roles.salary FROM roles
  INNER JOIN departments ON roles.department_id=departments.id
  ORDER BY roles.id ASC`;

  db.query(sql, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    await console.table(result);
    menu();
  });
}

function insertRole(name, salary, id) {
  const sql = `INSERT INTO roles (title, salary, department_id)
    VALUE ("${name}", "${salary}", "${id}")`;

  db.query(sql, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }
    new_employee[2].choices.push(name);
    update_role[1].choices.push(name);
    await console.log(`Added ${name} to the database.`);
    menu();
  });
}

function addRole() {
  inquirer.prompt(new_role).then((response) => {
    const sql = `SELECT * FROM departments WHERE departments.department = ?`;

    db.query(sql, response.department_role, async (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(result);
      insertRole(response.role_name, response.salary, result[0].id);
    });
  });
}

function viewDepartment() {
  const sql = `SELECT * FROM departments
  ORDER BY departments.id ASC`;

  db.query(sql, async (err, result) => {
    if (err) {
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
      if (err) {
        console.log(err.message);
        return;
      }
      new_role[2].choices.push(response.department_name);
      await console.log(`Added ${response.department_name} to the database.`);
      menu();
    });
  });
}

function menu() {
  inquirer.prompt(main_menu).then((response) => {
    if (response.user_choice == "View All Employees") {
      viewEmployee(); //Done
    } else if (response.user_choice == "Add Employee") {
      addEmployee();//Done
    } else if (response.user_choice == "Update Employee Role") {
      updateRole();
    } else if (response.user_choice == "View All Roles") {
      viewRole(); //Done
    } else if (response.user_choice == "Add Role") {
      addRole(); //Done
    } else if (response.user_choice == "View All Departments") {
      viewDepartment(); //Done
    } else if (response.user_choice == "Add Department") {
      addDepartment(); //Done
    } else {
      //Done
      console.log("Exiting...");
      process.exit();
    }
  });
}

function preEditQuestion() {
  const sql_roles = `SELECT title FROM roles ORDER BY title ASC`;

  db.query(sql_roles, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }

    for (let role of result) {
      new_employee[2].choices.push(role.title);
      update_role[1].choices.push(role.title);
    }
    //console.log(new_employee[2].choices);
  });

  const sql_departments = `SELECT department FROM departments ORDER BY department ASC`;

  db.query(sql_departments, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }

    for (let department of result) {
      new_role[2].choices.push(department.department);
    }
  });

  const sql_manager = `SELECT first_name, last_name
    FROM employees WHERE manager_id IS NULL ORDER BY last_name ASC`;

  db.query(sql_manager, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }

    for (let manager of result) {
      new_employee[3].choices.push(
        `${manager.first_name} ${manager.last_name}`
      );
    }
  });

  const sql_roleUpdate = `SELECT CONCAT(first_name, " ", last_name) AS name
    FROM employees ORDER BY last_name ASC`;

  db.query(sql_roleUpdate, async (err, result) => {
    if (err) {
      console.log(err.message);
      return;
    }

    for (let employee of result) {
        update_role[0].choices.push(employee);
    }
    await menu();
  });
}

preEditQuestion();
