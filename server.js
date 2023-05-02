// import mysql2
const mysql = require('mysql2')
// import inquirer 
const inquirer = require('inquirer'); 
// import console.table
const cTable = require('console.table'); 
const { default: prompt } = require('inquirer/lib/ui/prompt');

require('dotenv').config()

//Connect to database

const db= mysql.createConnection({
    host:'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
},

console.log(`Connected to the business_db database`));
db.connect(function (err) {
    if (err) throw err;
    afterConnection();
  });
  
// function after connection is established and welcome image shows 
afterConnection = () => {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*        EMPLOYEE MANAGER         *")
  console.log("*                                 *")
  console.log("***********************************")
  promptUser();
};

// TODO: Create a function to initialize queries
let promptUser= function() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "Options",
          choices: ["View All Employees", "Add Employee","Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
          message: "What would you like to do?",
        },
      ])
      .then((answers) => {

        let {Options}=answers;

        if (Options === "View All Departments") {
            showDepartments();
          }
          
          
          if(Options === "View All Roles"){
            viewRoles();
          }

          if(Options === "View All Employees"){
            viewEmployees();
            console.log("this is working")
          }
          console.log(answers);
      });
  }

  showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  
    db.promise().query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      throw err;
    });
  };

  viewRoles =()=>{
    console.log('Showing all roles..\n')
    const sql = `SELECT role.id, role.title, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id`;

    db.promise().query(sql)
    .then(([rows]) => {
      console.table(rows);
      promptUser();
    })
    .catch((err) => {
      throw err;
    });

  }

viewEmployees =()=>{
    console.log('Showing all employees..\n');

    const sql = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.promise().query(sql)
    .then(([rows])=>{
        console.table(rows);
        promptUser();
    })
    .catch((err)=>{
        throw err;
    });
}