// Get HTML elements
const studentTableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");
const averageMarks = document.getElementById("averageMarks");
const averageAttendance = document.getElementById("averageAttendance");
let students = [];

const API_URL = "https://student-smart-tracker.onrender.com/api/students";

async function loadStudents() {
    try {
        studentTableBody.innerHTML = `
    <tr>
        <td colspan="6" style="text-align: center;">
            Loading students...
        </td>
    </tr>
`;
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load students");
        }

        students = await response.json();

        displayStudents(students);
        updateDashboard(students);

    } catch (error) {

    console.error("Error:", error);

    studentTableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center;">
                Unable to load students. Please check the server.
            </td>
        </tr>
    `;

    totalStudents.textContent = "0";
    averageMarks.textContent = "0%";
    averageAttendance.textContent = "0%";
}
}

// Display students
function displayStudents(studentList) {

    studentTableBody.innerHTML = "";

    if (studentList.length === 0) {

        studentTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    No students found
                </td>
            </tr>
        `;

        return;
    }

    studentList.forEach(function(student) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.roll_no}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.marks}%</td>
            <td>${student.attendance}%</td>
            <td>
                <button onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });
}
// Load students from MySQL
loadStudents();


// Update dashboard statistics
function updateDashboard(studentList) {

    totalStudents.textContent = studentList.length;

    if (studentList.length === 0) {
        averageMarks.textContent = "0%";
        averageAttendance.textContent = "0%";
        return;
    }

    const totalMarks = studentList.reduce(
        (sum, student) => sum + Number(student.marks),
        0
    );

    const totalAttendance = studentList.reduce(
        (sum, student) => sum + Number(student.attendance),
        0
    );

    const marksAverage = totalMarks / studentList.length;
    const attendanceAverage = totalAttendance / studentList.length;

    averageMarks.textContent = `${marksAverage.toFixed(1)}%`;
    averageAttendance.textContent = `${attendanceAverage.toFixed(1)}%`;
}
// Delete student
async function deleteStudent(studentId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${studentId}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Student deleted successfully!");

        // Reload students from MySQL
        loadStudents();

    } catch (error) {

        console.error("Error:", error);
        alert("Student delete nahi ho pa raha.");

    }
}

// Edit Student Form

const editStudentForm = document.getElementById("editStudentForm");
const editForm = document.getElementById("editForm");
const editCancelBtn = document.getElementById("editCancelBtn");

let editingStudentId = null;


// Open Edit Form
async function editStudent(studentId) {

    const student = students.find(function(student) {
        return student.id === studentId;
    });

    if (!student) {
        return;
    }

    editingStudentId = studentId;

    document.getElementById("editRollNo").value = student.roll_no;
    document.getElementById("editStudentName").value = student.name;
    document.getElementById("editCourse").value = student.course;
    document.getElementById("editMarks").value = student.marks;
    document.getElementById("editAttendance").value = student.attendance;

    editStudentForm.style.display = "block";

    editStudentForm.scrollIntoView({
        behavior: "smooth"
    });
}


// Cancel Edit
editCancelBtn.addEventListener("click", function() {

    editStudentForm.style.display = "none";

    editForm.reset();

    editingStudentId = null;

});


// Update Student
editForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (!editingStudentId) {
        return;
    }

    const rollNo = Number(
        document.getElementById("editRollNo").value
    );

    const name = document
        .getElementById("editStudentName")
        .value
        .trim();

    const course = document
        .getElementById("editCourse")
        .value
        .trim();

    const marks = Number(
        document.getElementById("editMarks").value
    );

    const attendance = Number(
        document.getElementById("editAttendance").value
    );


    if (name.length < 2) {
        alert("Student name must contain at least 2 characters.");
        return;
    }

    if (marks < 0 || marks > 100) {
        alert("Marks must be between 0 and 100.");
        return;
    }

    if (attendance < 0 || attendance > 100) {
        alert("Attendance must be between 0 and 100.");
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${editingStudentId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rollNo: rollNo,
                    name: name,
                    course: course,
                    marks: marks,
                    attendance: attendance
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Student updated successfully!");

        editStudentForm.style.display = "none";

        editForm.reset();

        editingStudentId = null;

        loadStudents();

    } catch (error) {

        console.error("Error:", error);

        alert("Student update nahi ho pa raha.");

    }

});
// Add Student Form

const addStudentBtn = document.getElementById("addStudentBtn");
const studentForm = document.getElementById("studentForm");
const addStudentForm = document.getElementById("addStudentForm");
const cancelBtn = document.getElementById("cancelBtn");


// Open form
addStudentBtn.addEventListener("click", function() {
    studentForm.style.display = "block";
});


// Close form
cancelBtn.addEventListener("click", function() {
    studentForm.style.display = "none";
    addStudentForm.reset();
});


addStudentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const rollNo = Number(document.getElementById("rollNo").value);
    const name = document.getElementById("studentName").value.trim();
    const course = document.getElementById("course").value.trim();
    const marks = Number(document.getElementById("marks").value);
    const attendance = Number(
        document.getElementById("attendance").value
    );

    // Validate student name
    if (name.length < 2) {
        alert("Student name must contain at least 2 characters.");
        return;
    }

    // Validate marks
    if (marks < 0 || marks > 100) {
        alert("Marks must be between 0 and 100.");
        return;
    }

    // Validate attendance
    if (attendance < 0 || attendance > 100) {
        alert("Attendance must be between 0 and 100.");
        return;
    }

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rollNo: rollNo,
                name: name,
                course: course,
                marks: marks,
                attendance: attendance
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Student added successfully!");

        addStudentForm.reset();
        studentForm.style.display = "none";

        // Reload students from MySQL
        loadStudents();

    } catch (error) {

        console.error("Error:", error);
        alert("Student add nahi ho pa raha.");

    }

});
// Search Students

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredStudents = students.filter(function(student) {

        const name = student.name.toLowerCase();
        const rollNo = String(student.roll_no).toLowerCase();
        const course = student.course.toLowerCase();

        return (
            name.includes(searchText) ||
            rollNo.includes(searchText) ||
            course.includes(searchText)
        );

    });

    displayStudents(filteredStudents);
});