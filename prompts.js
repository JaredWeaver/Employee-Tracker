const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const chalkAnimation = require('chalk-animation');
const consoleTable = require('console.table');

const mainMenu = () => {

console.log(chalk.greenBright('===================================================================================================='));

console.log(chalk.magentaBright(figlet.textSync('Employee Tracker')))

console.log(chalk.magentaBright('                                         Created By: Jared Weaver'));


console.log(chalk.greenBright('===================================================================================================='));
//begins questioning 
    inquirer.prompt([
        {
        type: 'list',
        message: "What would you like to do?",
        name: 'mainMenuChoice',
        choices: [
            'Add Department',
            'Add Role',
            'Add Employee', 
            'View Departments',
            'View Roles',
            'View Employees',
            'Update Employee Role',
            'Update Employee Managers',
            'View Employees by Manager',
            'View Total Utilized Budget by Department',
            'Exit'
        ] 
        }
    ])
}

const addDepartment = () => {

}

const addRoles = () => {

}

const addEmployees= () => {

}

const viewDepartments = () => {

}

const viewRoles = () => {

}

const viewEmployees = () => {

}

const updateRoles = () => {

}

//BONUS FUNCTIONS

const updateEmployeeMgr = () => {

}

const viewEmployeeByMgr = () => {

};

const deleteObject = (department, role, manager) => {

};

const combineSalaries = () => {

};






mainMenu();