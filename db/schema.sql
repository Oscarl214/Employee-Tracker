DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

USE business_db;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT, /* will be the id that connects to role and employee table */
    name VARCHAR(30) /* holds department name */
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30), /* holds role title*/
    salary DECIMAL, /* holds role salary*/
    department_id INT,   /* holds holds refrence to department role belongs to*/
    INDEX dep_ind (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee(
    id INT PRIMARY KEY AUTO_INCREMENT, 
    first_name VARCHAR(30),  /* holds employees first name*/
    last_name VARCHAR(30),  /* holds employees last name*/
    role_id INT,  /* holds refrence to employees role*/
    INDEX role_ind (role_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    manager_id INTEGER,
    INDEX manager_ind (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);