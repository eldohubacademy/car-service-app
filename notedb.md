Here’s the SQL code to build the **EldoHubLMS** database as per the schema you provided. This will include tables for `courses`, `instructors`, `resources`, and `students` with the appropriate primary and foreign keys.

---

### SQL Code to Build the Database

```sql
-- Create a new database
CREATE DATABASE EldoHubLMS;

-- Switch to the EldoHubLMS database
USE EldoHubLMS;

-- Table for Courses
CREATE TABLE Courses (
    courseid INT AUTO_INCREMENT,  -- Primary Key
    name VARCHAR(100) NOT NULL,
    durationinmonths INT NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (courseid)
);

-- Table for Instructors
CREATE TABLE Instructors (
    email VARCHAR(100) NOT NULL,  -- Primary Key
    fullname VARCHAR(100) NOT NULL,
    course_id INT,  -- Foreign Key from Courses
    phone VARCHAR(15),
    PRIMARY KEY (email),
    FOREIGN KEY (course_id) REFERENCES Courses(courseid)
        ON DELETE SET NULL ON UPDATE CASCADE  -- Handling referential integrity
);

-- Table for Resources
CREATE TABLE Resources (
    resourceid INT AUTO_INCREMENT,  -- Primary Key
    name VARCHAR(100) NOT NULL,
    description TEXT,
    filetype VARCHAR(50),
    link VARCHAR(255),
    course_id INT,  -- Foreign Key from Courses
    PRIMARY KEY (resourceid),
    FOREIGN KEY (course_id) REFERENCES Courses(courseid)
        ON DELETE CASCADE ON UPDATE CASCADE  -- Handling referential integrity
);

-- Table for Students
CREATE TABLE Students (
    regno VARCHAR(20) NOT NULL,  -- Primary Key
    email VARCHAR(100) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    course_id INT,  -- Foreign Key from Courses
    age INT,
    dateofenrollment DATE,
    PRIMARY KEY (regno),
    FOREIGN KEY (course_id) REFERENCES Courses(courseid)
        ON DELETE SET NULL ON UPDATE CASCADE  -- Handling referential integrity
);

-- Optional: Insert some sample data

-- Insert sample data into Courses table
INSERT INTO Courses (name, durationinmonths, cost)
VALUES ('Full-Stack Development', 6, 50000.00),
       ('Data Science', 12, 75000.00);

-- Insert sample data into Instructors table
INSERT INTO Instructors (email, fullname, course_id, phone)
VALUES ('john.doe@example.com', 'John Doe', 1, '0712345678'),
       ('jane.smith@example.com', 'Jane Smith', 2, '0719876543');

-- Insert sample data into Resources table
INSERT INTO Resources (name, description, filetype, link, course_id)
VALUES ('HTML Basics', 'Intro to HTML', 'pdf', 'http://example.com/html.pdf', 1),
       ('Python for Data Science', 'Learn Python for Data Science', 'video', 'http://example.com/python.mp4', 2);

-- Insert sample data into Students table
INSERT INTO Students (regno, email, fullname, course_id, age, dateofenrollment)
VALUES ('STU001', 'alice@example.com', 'Alice Johnson', 1, 22, '2023-09-01'),
       ('STU002', 'bob@example.com', 'Bob Martin', 2, 25, '2023-08-15');
```

### Explanation of the Schema and SQL Code:

1. **Primary Keys**:

   - `courseid` in the `Courses` table.
   - `email` in the `Instructors` table.
   - `resourceid` in the `Resources` table.
   - `regno` in the `Students` table.

2. **Foreign Keys**:

   - `course_id` in `Instructors`, `Resources`, and `Students` tables refers to the `courseid` in the `Courses` table. This links instructors, resources, and students to the specific courses they are involved in.

3. **Referential Integrity**:
   - **`ON DELETE SET NULL`**: If a course is deleted, the `course_id` in the `Instructors` and `Students` tables will be set to `NULL`, preserving the instructor and student data but breaking the course relationship.
   - **`ON DELETE CASCADE`**: If a course is deleted, the corresponding `Resources` for that course will be automatically deleted.
   - **`ON UPDATE CASCADE`**: If the `courseid` is updated, the change will propagate to related tables.

### Data Types:

- `INT AUTO_INCREMENT`: Automatically increments for each new record in the `Courses` and `Resources` tables.
- `VARCHAR`: Used for textual data such as names, emails, and phone numbers.
- `DECIMAL`: Used for storing monetary values with two decimal places.
- `DATE`: Used for storing the enrollment date in the `Students` table.

---

This SQL code will create the database and tables according to your requirements, ensuring proper relationships between the different entities. The optional sample data helps you test the schema as well.
