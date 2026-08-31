# Student Smart Tracker

Student Smart Tracker is a web-based student management system.

It allows users to add, view, edit, delete, and search student records.

The project stores student data in a MySQL database.

## Features

- Add new students
- View all students
- Edit student information
- Delete students
- Search students by name
- Calculate total students
- Calculate average marks
- Calculate average attendance
- Input validation
- MySQL database integration
- Responsive design

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL

## Project Structure

```text
Student-Smart-Tracker/
│
├── Backend/
│   └── server.js
│
├── Frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── package.json
├── package-lock.json
└── README.md
```
## API Endpoints
| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/students`     | Get all students  |
| POST   | `/api/students`     | Add a new student |
| PUT    | `/api/students/:id` | Update a student  |
| DELETE | `/api/students/:id` | Delete a student  |

## How to Run

### 1. Install Dependencies

Open the terminal in the project folder and run:

npm install

### 2. Start the Backend

Open the terminal and run:

node Backend/server.js

### 3. Open the Application

Open the frontend in your browser using your local development server.

### 4. Make Sure MySQL Is Running

Make sure MySQL is running before using the application.

## Future Improvements

- Student login and authentication
- Charts and analytics
- Export student data to Excel or PDF
- Pagination
- Student profile pages
- Live deployment

## Author

Developed by Sheeba as a BCA project.