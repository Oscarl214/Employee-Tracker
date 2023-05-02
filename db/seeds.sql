INSERT INTO department (id, name)
VALUES (1,"Engineering"),
       (2,"Finance"),
       (3,"Legal"),
       (4,"Sales");

INSERT INTO employee (id,first_name,last_name,role_id, manager_id)
VALUES (01,"Oscar", "Leal", 1, NULL),
       (02,"Alex", "Curuzzo", 2,4),
       (03,"Lebron", "James", 5, NULL),
       (04,"Karina", "Gomez", 3, NULL),
       (05,"Lexi", "Tyler", 4,NULL ),
       (06,"Gabe", "Lopez", 2, 4);

INSERT INTO role(id, title, salary, department_id)
VALUES (1,"Full Stack Engineer", 120000, 1),
       (2,"Sales Person", 70000,4),
       (3,"Account Manager", 110000,4),
       (4,"Accountant", 90000,2),
       (5,"Lawyer", 100000,3);