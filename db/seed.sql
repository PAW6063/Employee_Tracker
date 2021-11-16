INSERT INTO departments (d_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Legal Lead", 250000, 3),
       ("Finance Lead", 160000, 2),
       ("Engineering Lead", 300000, 1),
       ("Sales Team Memeber", 50000, 4),
       ("Lawyer", 90000, 3),
       ("Accountant", 60000, 2),
       ("Engineer", 120000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Mr.", "Salesman", 1, NULL),
       ("Prof.", "Laywerman", 2, NULL),
       ("Doc.", "Moneyman", 3, NULL),
       ("Mr. Doc. Prof.", "Patrick", 4, NULL),
       ("Sale", "One", 5, 1),
       ("Laywer", "One", 6, 2),
       ("Finanace", "One", 7, 3),
       ("Engineer", "One", 8, 4);