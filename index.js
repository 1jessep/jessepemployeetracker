const mysql = require("mysql2");
const inquirer = require("inquirer");
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

const mainMenu = () => {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "select your task",
      choices: ["Show departments", "Show roles", "Show employees"],
    })
    .then(({ task }) => {
      switch (task) {
        case "Show departments":
          showDepartments();
          break;
        case "Show roles":
          showRoles();
          break;
        case "Show employees":
          showEmployees();
          break;
        default:
          break;
      }
    });
};

const showDepartments = () => {
  db.promise()
    .query("SELECT * FROM department")
    .then(([departments]) => {
      console.table(departments);
      mainMenu();
    });
};

const showRoles = () => {
  db.promise()
    .query("SELECT * FROM role")
    .then(([roles]) => {
      console.table(roles);
      mainMenu();
    });
};

const showEmployees = () => {
  db.promise()
    .query("SELECT * FROM employee")
    .then(([employees]) => {
      console.table(employees);
      mainMenu();
    });
};
mainMenu();
