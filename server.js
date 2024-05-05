const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON request body
app.use(express.json());

// Read student data from the JSON file
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

// Route to search for a student by name
app.post('/search', (req, res) => {
  const searchName = req.body.searchName.toLowerCase();

  const matchingStudents = Object.values(data).filter(student => {
    return student.Name.toLowerCase().includes(searchName);
  });

  res.json(matchingStudents);
});

// Route to compare multiple students
app.post('/compare', (req, res) => {
  const names = req.body.names;
  const comparisonData = [];

  names.forEach(name => {
    const student = Object.values(data).find(student => student.Name.toLowerCase() === name);
    if (student) {
      const studentData = {
        name: student.Name,
        rollNo: student['Roll_No'],
        semesters: {
          'Semester I': { SGPA: student.SEM_I },
          'Semester II': { SGPA: student.SEM_II },
          'Semester III': { SGPA: student.SEM_III },
          'Semester IV': { SGPA: student.SEM_IV },
          'Semester V': { SGPA: student.SEM_V }
        }
      };
      comparisonData.push(studentData);
    }
  });

  res.json(comparisonData);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Assuming you already have the express app set up
app.post('/result', (req, res) => {
  const rollNumber = req.body.rollNumber;
  // Retrieve the student data based on the roll number
  const student = data[rollNumber];
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});
