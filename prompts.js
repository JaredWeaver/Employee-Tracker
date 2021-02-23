const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const connection = require('./db.js')

const init = () => {

    connection.connect((err) => {
        if (err) throw err;

            console.log(chalk.greenBright('===================================================================================================='));

            console.log(chalk.magentaBright(figlet.textSync('Employee Tracker')))

            console.log(chalk.redBright('                                         Created By: Jared Weaver'));

            console.log(chalk.greenBright('===================================================================================================='));
            //begins questioning 
            mainMenu();
    });
}
    
const mainMenu = () => {

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
    ]).then(response => {
        const {choices} = response;
        console.log({choices});

    });
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






init();