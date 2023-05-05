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
            console.log("this is working");
            viewEmployees();
          }

          if(Options === "Add Department"){
            addDepartment();
            console.log("This works")
          }

          if(Options==="Add Role"){
            addRole();
            console.log("this is working")
          }

          if(Options === "Add Employee"){
            addEmployee();
          }

          if(Options=== "Update Employee Role"){
            updateEmployee()
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

addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDept',
        message: "What department do you want to add?",
        validate: addDept => {
          if (addDept) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        db.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDept + " to departments!"); 
  
          showDepartments();
      });
    });
  };

  addRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "What role do you want to add?",
        validate: role => {
          if (role) {
              return true;
          } else {
              console.log('Please enter a role');
              return false;
          }
        }
      }, 
      {
        type: 'input',
        name: 'salary',
        message: "Please add approriate salary for role",
        validate: salary =>{
            if(salary){
                return true;
            }else{
                console.log("Please enter a salary")
            }
        }
      },
    ])
    .then(answer => {
        const params = [answer.role, answer.salary];

      // grab dept from department table
      const roleSql = `SELECT name, id FROM department`;

      db.promise()
        .query(roleSql)
        .then(([rows, fields]) => {
          const dept = rows.map(({ name, id }) => ({ name: name, value: id }));

          return inquirer.prompt([
            {
              type: 'list',
              name: 'dept',
              message: 'What department is this role in?',
              choices: dept,
            },
          ]);
        })
        .then((deptChoice) => {
          const dept = deptChoice.dept;
          params.push(dept);

          const sql = `INSERT INTO role (title, salary, department_id)
                      VALUES (?, ?, ?)`;

          return db.promise().query(sql, params);
        })
        .then(([rows, fields]) => {
          console.log('Added' + answer.role + ' to roles!');
          viewRoles();
        })
        .catch((error) => {
          console.error(error);
        });
    });
};

//When I choose to add an employee
//THEN I am prompted to enter the employee’s first name, last name, role, 
//and manager, and that employee is added to the database
addEmployee=()=>{
    inquirer.prompt([
        {
          type: 'input', 
          name: 'first',
          message: "Please add Employees first name?",
          validate: first => {
            if (first) {
                return true;
            } else {
                console.log('Please enter a name');
                return false;
            }
          }
        }, 
        {
          type: 'input',
          name: 'last',
          message: "Please enter employees last name",
          validate: last =>{
              if(last){
                  return true;
              }else{
                  console.log("Please enter employees last name")
              }
          }
        }
      ]).then(answer=>{
        const params = [answer.first, answer.last];

        const roleSql = `SELECT role.id, role.title FROM role`;


        db.promise().query(roleSql)
        .then(([rows, fields]) => {
            const roles = rows.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What role is the employees role?",
                    choices: roles
                }
            ])
            .then(roleChoice=>{
                const role=roleChoice.role;
                params.push(role);
    
                const managerSql = `SELECT * FROM employee`;
    
                db.promise().query(managerSql)
                .then(([rows,fields])=>{
                    const managers = rows.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);
    
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
    
                        db.promise().query(sql, params)
                        .then(result => {
                            console.log("Employee has been added!");
                            viewEmployees();
                        })
                        .catch(err => {
                            throw err;
                        });
                    });
                }).catch(err=>{
                    throw err;
                });
            });
        })
        .catch((err) => {
            throw err;
        });
      });
    };
// function to update an employee 
updateEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    db.promise().query(employeeSql)
      .then(([data, fields]) => {
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
        inquirer.prompt([
          {
            type: 'list',
            name: 'name',
            message: "Which employee would you like to update?",
            choices: employees
          }
        ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM role`;
  
          db.promise().query(roleSql)
            .then(([data, fields]) => {
              const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role); 
  
                let employee = params[0]
                params[0] = role
                params[1] = employee 
  
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                db.promise().query(sql, params)
                  .then(result => {
                    console.log("Employee has been updated!");
                    viewEmployees();
                  })
                  .catch(err => {
                    throw err;
                  });
              });
            })
            .catch(err => {
              throw err;
            });
        });
      })
      .catch(err => {
        throw err;
      });
  };
  