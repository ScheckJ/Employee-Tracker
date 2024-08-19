INSERT INTO department (name) VALUES 
('Grocery'),
('Bakery'),
('Deli'),
('Seafood');

INSERT INTO role (title, salary, department_id) VALUES
('Clerk', 80000, 1),
('Baker', 60000, 2),
('Cutter', 120000, 3),
('Cook', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Robert', 'Freeman', 1, 4),
('Willie', 'Jones', 2, 3),
('Curtis', 'Snow', 3, 2),
('Dwayne', 'Carter', 4, 1);