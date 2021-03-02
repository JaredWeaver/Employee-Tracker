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
          "Remove Employee",
          "Remove Department",
          "Remove Role",
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
        case "View Employees by Manager":
          viewEmployeeByMgr();
          break;
        case "View Total Utilized Budget by Department":
          departmentBudget();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Remove Department":
          removeDept();
          break;
        case "Remove Role":
          removeRole();
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
    ON manager.id=employee.manager_id;`,
    (err, res) => {
      if (err) throw err;
      printTable(res);
      mainMenu();
    }
  );
};

const updateRoles = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    const updatedRoles = res.map((roles) => {
      return {
        name: roles.title,
        value: roles.id,
      };
    });
    connection.query("SELECT * FROM employee", (err, data) => {
      const updateEmployeeArr = data.map((employee) => {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            name: "employee",
            choices: updateEmployeeArr,
          },
          {
            type: "list",
            message: "What is the employees new role?",
            name: "role",
            choices: updatedRoles,
          },
        ])
        .then((response) => {
          //delete role from chosen employee and add new one?
          let roleRes = response.role;
          let employeeRes = response.employee;
          connection.query(
            `UPDATE employee SET role_id=${roleRes} WHERE id=${employeeRes}`
          );
          if (err) throw err;
          console.log("Employee successfully updated.");
          mainMenu();
        });
    });
  });
};

const updateEmployeeMgr = () => {
  connection.query("SELECT * FROM employee", (err, data) => {
    const updateEmployeeMgrArr = data.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
        manager: employee.manager_id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to update?",
          name: "employee",
          choices: updateEmployeeMgrArr,
        },
        {
          type: "list",
          message: "Who is the employees new manager?",
          name: "newMgr",
          choices: updateEmployeeMgrArr,
        },
      ])
      .then((response) => {
        //delete role from chosen employee and add new one?
        let employeeChoice = response.employee;
        let updatedMgr = response.newMgr;
        connection.query(
          `UPDATE employee SET manager_id=${updatedMgr} WHERE id=${employeeChoice}`
        );
        if (err) throw err;
        console.log("Employee's manager successfully updated.");
        mainMenu();
      });
  });
};

const viewEmployeeByMgr = () => {
  connection.query(
    `SELECT CONCAT(manager.first_name, " ", manager.last_name) manager, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, roles.title
    FROM employee 
    LEFT JOIN employee manager
    ON manager.id=employee.manager_id
	  INNER JOIN roles 
    ON employee.role_id=roles.id
    ORDER BY manager;`,
    (err, res) => {
      if (err) throw err;
      printTable(res);
      mainMenu();
    }
  );
};

const removeEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    let arr = res.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: `"Which employee would you like to remove?"`,
          name: "terminate",
          choices: arr,
        },
      ])
      .then((remove) => {
        let removeThis = remove.terminate;
        connection.query(`DELETE FROM employee WHERE id=${removeThis}`);
        if (err) throw err;
        console.log("Employee successfully removed.");
        mainMenu();
      });
  });
};

const removeRole = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    let arr = res.map((roles) => {
      return {
        name: roles.title,
        value: roles.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: `"Which role would you like to remove?"`,
          name: "terminate",
          choices: arr,
        },
      ])
      .then((remove) => {
        let removeThis = remove.terminate;
        connection.query(`DELETE FROM roles WHERE id=${removeThis}`);
        if (err) throw err;
        console.log("Role successfully removed.");
        mainMenu();
      });
  });
};

const removeDept = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    let arr = res.map((department) => {
      return {
        name: department.department_name,
        value: department.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: `"Which department would you like to remove?"`,
          name: "terminate",
          choices: arr,
        },
      ])
      .then((remove) => {
        let removeThis = remove.terminate;
        connection.query(`DELETE FROM department WHERE id=${removeThis}`);
        if (err) throw err;
        console.log("Department successfully removed.");
        mainMenu();
      });
  });
};

const departmentBudget = () => {
  connection.query(
    `SELECT department_id AS id, 
    department.department_name AS departments,
    SUM(salary) AS salaries
    FROM  roles  
    INNER JOIN department ON roles.department_id = department.id GROUP BY roles.department_id;`,
    (err, res) => {
      if (err) throw err;
      printTable(res);
      mainMenu();
    }
  );

};

init();
