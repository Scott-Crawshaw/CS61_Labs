-- Scott Crawshaw
-- Dartmouth CS61
-- Spring 2020
-- Lab 3

use nyc_inspections;

DROP TABLE IF EXISTS Employees;
CREATE TABLE Employees (
	EmployeeID int NOT NULL AUTO_INCREMENT,
    FullName varchar(255),
    Salary int,
    DateOfHire date,
    isAdmin bool DEFAULT false,
    Username varchar(255),
    Password char(60),
    PRIMARY KEY (EmployeeID)
);

-- default user has username of username and password of password
-- use this account to make a new user, then delete this account
INSERT INTO Employees (FullName, Salary, DateOfHire, isAdmin, Username, Password)
VALUES ('Default User', 91000, CURDATE(), true, 'username', '$2b$10$hpFIxPT0rOK4fxPf5uHcN.jzAK66nKCRqG35cWkk1uUCrWqxoddcC');