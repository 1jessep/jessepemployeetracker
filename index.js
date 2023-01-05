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
      choices: [
        "Show Departments",
        "Show Roles",
        "Show Employees",
        "Add new Department",
        "Update Department Name",
        "Add New Role",
        "Add Employee",
        "Update Role",
      ],
    })
    .then(({ task }) => {
      switch (task) {
        case "Show Departments":
          showDepartments();
          break;
        case "Show Roles":
          showRoles();
          break;
        case "Show Employees":
          showEmployees();
          break;
        case "Add new Department":
          addDepartment();
          break;
        case "Update Department Name":
          updateDepartment();
          break;
        case "Add New Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Role":
          updateRole();
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

const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "departmentName",
      message: "Please enter new Department Name.",
    })
    .then((answer) => {
      var departmentObject = { dept_name: answer.departmentName };
      db.promise()
        .query("INSERT INTO department SET ?", departmentObject)
        .then(([res]) => {
          if (res.affectedRows > 0) {
            showDepartments();
          } else {
            console.error("Failed to create Department");
            mainMenu();
          }
        });
    });
};

const updateDepartment = async () => {
  const [departments] = await db.promise().query("SELECT * FROM department");
  const departmentArray = departments.map((department) => ({
    name: department.dept_name,
    value: department.id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "deptId",
        message: "Select a Department",
        choices: departmentArray,
      },
      {
        type: "input",
        name: "deptName",
        message: "Please enter the new Department Name",
      },
    ])
    .then((answers) => {
      console.log(answers);
      var departmentObject = {
        dept_name: answers.deptName,
      };
      db.promise()
        .query("UPDATE department SET ? WHERE department.id = ?", [
          departmentObject,
          answers.deptId,
        ])
        .then(([res]) => {
          if (res.affectedRows > 0) {
            showDepartments();
          } else {
            console.error("Failed to update Department");
            mainMenu();
          }
        });
    });
};

const addRole = async () => {
  const [departments] = await db.promise().query("SELECT * FROM department");
  const departmentArray = departments.map((department) => ({
    name: department.dept_name,
    value: department.id,
  }));
  inquirer
    .prompt([
      { type: "input", name: "title", message: "Please enter the new Title" },
      { type: "input", name: "salary", message: "Please enter the Salary" },
      {
        type: "list",
        name: "deptId",
        message: "Please select a Department",
        choices: departmentArray,
      },
    ])
    .then((answers) => {
      var roleObject = {
        title: answers.title,
        salary: answers.salary,
        dept_id: answers.deptId,
      };
      db.promise()
        .query("INSERT INTO role SET ?", roleObject)
        .then(([res]) => {
          if (res.affectedRows > 0) {
            showDepartments();
          } else {
            console.error("Failed to add Role");
            mainMenu();
          }
        });
    });
};

function addEmployee() {
  db.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the employee's fist name? ",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the employee's last name? ",
        },
        {
          name: "manager_id",
          type: "input",
          message: "What is the employee's manager's ID? ",
        },
        {
          name: "role",
          type: "list",
          choices: function () {
            var roleChoices = [];
            for (let i = 0; i < res.length; i++) {
              roleChoices.push(res[i].title);
            }
            return roleChoices;
          },
          message: "What is this employee's role? ",
        },
      ])
      .then(function (answer) {
        let role_id;
        for (let a = 0; a < res.length; a++) {
          if (res[a].title == answer.role) {
            role_id = res[a].id;
            console.log(role_id);
          }
        }
        db.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            manager_id: answer.manager_id,
            role_id: role_id,
          },
          function (err) {
            if (err) throw err;
            mainMenu();
          }
        );
      });
  });
}

const updateRole = () => {
  db.query("SELECT * FROM EMPLOYEE", (err, emplRes) => {
    if (err) throw err;
    const employeeChoice = [];
    emplRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    db.query("SELECT * FROM ROLE", (err, rolRes) => {
      if (err) throw err;
      const roleChoice = [];
      rolRes.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id,
        });
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "whose role do you want to update?",
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "what is the employee's new role?",
        },
      ];

      inquirer
        .prompt(questions)
        .then((response) => {
          const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          db.query(
            query,
            [{ role_id: response.role_id }, "id", response.id],
            (err, res) => {
              if (err) throw err;
              mainMenu();
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
};

mainMenu();
