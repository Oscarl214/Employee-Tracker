SELECT d.id AS department_id, r.id AS role_id, e.id AS employee_id, e.first_name, e.last_name, r.title, r.salary
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id;
