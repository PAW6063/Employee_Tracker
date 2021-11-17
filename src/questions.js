const main_menu = [
    {
        name: "user_choice",
        message: "What would you like to do? ",
        type: "list",
        choices: ["View All Employees", "Add Employee", "Update Employee Role",
        "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
        default: "Quit"
    }
]

const new_department = [
    {
        name: "department_name",
        message: "What is the name of the department? ",
        type: "input"
    }
]

const new_role = [
    {
        name: "role_name",
        message: "What is the name of the role? ",
        type: "input"
    },
    {
        name: "salary",
        message: "What is the salary of the role? ",
        type: "input"
    },
    {
        name: "department_role",
        message: "Which department does the role belong to?",
        type: "list",
        choices: []
    }
]

const new_employee = [
    {
        name: "first_name",
        message: "What is the employee's first name? ",
        type: "input"
    },
    {
        name: "employee_name",
        message: "What is the employee's last name? ",
        type: "input"
    },
    {
        name: "employee_role",
        message: "What is the employee's role?",
        type: "list",
        choices: []
    }
]

module.exports = { main_menu, new_department, new_employee, new_role };