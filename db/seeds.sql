USE company_db;
INSERT INTO department(dept_name) VALUES("sales"), ("accounting"), ("engineering");
INSERT INTO role(title, salary, dept_id) VALUES("salesperson", 50000, 1), ("accountant", 60000, 2), ("engineer", 80000, 3);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Bobby", "Smith", 1, null), ("Johnny", "Ramierez", 2, null), ("Justin", "Beck", 3, null);