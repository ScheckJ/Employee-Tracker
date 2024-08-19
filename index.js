const inquirer = require('inquirer');
const { Client } = require('pg');

// Database connection
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_tracker',
  password: 'root',
  port: 5432,
});

client.connect();

const mainMenu = async () => {
  try {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    });

    switch (action) {
      case 'View all departments':
        return viewDepartments();
      case 'View all roles':
        return viewRoles();
      case 'View all employees':
        return viewEmployees();
      case 'Add a department':
        return addDepartment();
      case 'Add a role':
        return addRole();
      case 'Add an employee':
        return addEmployee();
      case 'Update an employee role':
        return updateEmployeeRole();
      case 'Exit':
        client.end();
        return;
    }
  } catch (error) {
    console.error('Error in main menu:', error);
    mainMenu();
  }
};

const viewDepartments = async () => {
  try {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
  } catch (error) {
    console.error('Error viewing departments:', error);
  }
  mainMenu();
};

const viewRoles = async () => {
  try {
    const res = await client.query(`
      SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      JOIN department ON role.department_id = department.id
    `);
    console.table(res.rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  }
  mainMenu();
};

const viewEmployees = async () => {
  try {
    const res = await client.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager_id
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
    `);
    console.table(res.rows);
  } catch (error) {
    console.error('Error viewing employees:', error);
  }
  mainMenu();
};

const addDepartment = async () => {
  try {
    const { name } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    });

    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Department ${name} added successfully!`);
  } catch (error) {
    console.error('Error adding department:', error);
  }
  mainMenu();
};

const addRole = async () => {
  try {
    const { title, salary, department_id } = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Enter the name of the role:' },
      { type: 'input', name: 'salary', message: 'Enter the salary for the role:' },
      { type: 'input', name: 'department_id', message: 'Enter the department ID for the role:' },
    ]);

    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Role ${title} added successfully!`);
  } catch (error) {
    console.error('Error adding role:', error);
  }
  mainMenu();
};

const addEmployee = async () => {
  try {
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      { type: 'input', name: 'first_name', message: 'Enter the employee\'s first name:' },
      { type: 'input', name: 'last_name', message: 'Enter the employee\'s last name:' },
      { type: 'input', name: 'role_id', message: 'Enter the role ID for the employee:' },
      { type: 'input', name: 'manager_id', message: 'Enter the manager ID for the employee (leave blank if none):' },
    ]);

    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id || null]);
    console.log(`Employee ${first_name} ${last_name} added successfully!`);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
  mainMenu();
};

const updateEmployeeRole = async () => {
  try {
    const { employee_id, role_id } = await inquirer.prompt([
      { type: 'input', name: 'employee_id', message: 'Enter the ID of the employee you want to update:' },
      { type: 'input', name: 'role_id', message: 'Enter the new role ID for the employee:' },
    ]);

    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Employee role updated successfully!');
  } catch (error) {
    console.error('Error updating employee role:', error);
  }
  mainMenu();
};

mainMenu();
