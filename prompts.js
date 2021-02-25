const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const connection = require("./db.js");
const { printTable } = require("console-table-printer");

const init = () => {
  connection.connect((err) => {
    if (err) throw err;

    console.log(
      chalk.greenBright(
        "===================================================================================================="
      )
    );

    console.log(chalk.magentaBright(figlet.textSync("Employee Tracker")));

    console.log(
      chalk.redBright(
        "                                         Created By: Jared Weaver"
      )
    );

    console.log(
      chalk.greenBright(
        "===================================================================================================="
      )
    );
    //begins questioning
    mainMenu();
  });
};

const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "mainMenuChoice",
        choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View Departments",
          "View Roles",
          "View Employees",
          "Update Employee Role",
          "Update Employee Managers",
          "View Employees by Manager",
          "View Total Utilized Budget by Department",
          "Exit",
        ],
      },
    ])
    .then((response) => {
      const answer = response.mainMenuChoice;
      console.log(answer);
      switch (answer) {
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRoles();
          break;
        case "Add Employee":
          addEmployees();
          break;
        case "View Departments":
          viewDepartments();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Employees":
          viewEmployees();
          break;
        case "Update Employee Role":
          updateRoles();
          break;
        case "Update Employee Managers":
          updateEmployeeMgr();
          break;
        case "View Employee by Manager":
          viewEmployeeByMgr();
          break;
        case "View Total Utilized Budget by Department":
          combineSalaries();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department you are adding?",
        name: "addDepartment",
      },
    ])
    .then((response) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: response.addDepartment,
        },
        (err) => {
          if (err) throw err;
          console.log("Your department was created successfully!");

          mainMenu();
        }
      );
    });
};

const addRoles = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    const dept = res.map((dept) => {
      return {
        name: dept.department_name,
        value: dept.id,
      };
    });
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role you are adding?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary of the role you are adding?",
          name: "salary",
        },
        {
          type: "list",
          message: "What is the department of the role?",
          name: "department_id",
          choices: dept,
        },

        //need to join with department id?
      ])
      .then((response) => {
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: response.title,
            salary: response.salary,
            department_id: response.department_id,
          },
          (err) => {
            if (err) throw err;
            console.log("Your role was created successfully!");
            mainMenu();
          }
        );
      });
  });
};

const addEmployees = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    const roles = res.map((roles) => {
      return {
        name: roles.title,
        value: roles.id,
      };
    });
    connection.query("SELECT * FROM employee", (err, data) => {
      const manager = data.map((employee) => {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the first name of the employee?",
            name: "first_name",
          },
          {
            type: "input",
            message: "What is the last name of the employee?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What is the employees role?",
            name: "role",
            choices: roles,
          },
          {
            type: "list",
            message: "Who is this employee's manager?",
            name: "manager",
            choices: manager,
          },

          //need to join with roles_id and manager_id
        ])
        .then((response) => {
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: response.first_name,
              last_name: response.last_name,
              role_id: response.role,
              manager_id: response.manager,
            },
            (err) => {
              if (err) throw err;
              console.log("Your employee was created successfully!");
              mainMenu();
            }
          );
        });
    });
  });
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    printTable(res);
    mainMenu();
  });
};

const viewRoles = () => {
  connection.query(
    `SELECT roles.id, roles.title, roles.salary, (department.department_name) department
    FROM roles 
    LEFT JOIN department
    ON roles.department_id = department.id;`,
    (err, res) => {
      if (err) throw err;
      printTable(res);
      mainMenu();
    }
  );
};

const viewEmployees = () => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, roles.title, CONCAT(manager.first_name, " ", manager.last_name) manager
    FROM employee 
    LEFT JOIN roles 
    ON employee.role_id=roles.id
    LEFT JOIN employee manager
    ON manager.manager_id=employee.id;`,
    (err, res) => {
      if (err) throw err;
      printTable(res);
      mainMenu();
    }
  );
};

const updateRoles = () => {};

//BONUS FUNCTIONS

const updateEmployeeMgr = () => {};

const viewEmployeeByMgr = () => {};

const remove = (choice, tableName, id) => {
  // connection.query(`SELECT * FROM ${tableName}`, (err, res) => {
  //   let arr = res.map((tableName) => {
  //     return {
  //       name: tableName.name,
  //       value: tableName.id,
  //     };
  //   });
  //   inquirer
  //     .prompt([
  //       {
  //         type: "list",
  //         message: `"Which ${choice} would you like to remove?"`,
  //         name: "del",
  //         choices: arr,
  //       },
  //     ])
  //     .then((remove) => {
  //       // let removeThis = remove.del;
  //       // connection.query(`DELETE FROM ${tableName} WHERE id=${id}`);
  //       // if(err) throw err;
  //       // console.log(`${choice} successfully removed.`)
  //       // mainMenu();
  //     });
  // });
};
const combineSalaries = () => {};

init();
