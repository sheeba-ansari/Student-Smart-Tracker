const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});
db.connect(function(err) {
    if (err) {
        console.error("MySQL connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully");
});
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("../Frontend"));

app.get("/", function(req, res) {
    res.json({
        message: "Student Smart Tracker API is running"
    });
});
app.get("/api/students", function(req, res) {

    db.query("SELECT * FROM students", function(err, results) {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });

});
// POST - Add a new student
app.post("/api/students", function(req, res) {

    const { rollNo, name, course, marks, attendance } = req.body;

    // Basic validation
    if (!rollNo || !name || !course || marks === undefined || attendance === undefined) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
        const sql = `
        INSERT INTO students
        (roll_no, name, course, marks, attendance)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        rollNo,
        name,
        course,
        marks,
        attendance
    ];

    db.query(sql, values, function(err, result) {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.status(201).json({
            message: "Student added successfully",
            student: {
                id: result.insertId,
                rollNo: rollNo,
                name: name,
                course: course,
                marks: marks,
                attendance: attendance
            }
        });

    });

});

// PUT - Update a student
app.put("/api/students/:id", function(req, res) {

    const studentId = Number(req.params.id);

    const { rollNo, name, course, marks, attendance } = req.body;

    const sql = `
        UPDATE students
        SET roll_no = ?,
            name = ?,
            course = ?,
            marks = ?,
            attendance = ?
        WHERE id = ?
    `;

    const values = [
        rollNo,
        name,
        course,
        marks,
        attendance,
        studentId
    ];

    db.query(sql, values, function(err, result) {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully"
        });

    });

});
// DELETE - Delete a student
app.delete("/api/students/:id", function(req, res) {

    const studentId = Number(req.params.id);

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [studentId], function(err, result) {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    });

});
app.listen(PORT, function() {
    console.log(`Server running on http://localhost:${PORT}`);
});