const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const csv = require('csv-parser');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON request body
app.use(express.json());

// Read student data from the CSV file
const studentData = [];
fs.createReadStream('result.csv')
  .pipe(csv())
  .on('data', (row) => {
    studentData.push(row);
  })
  .on('end', () => {
    console.log('Student data loaded from CSV');
  });

// Route to handle the result analysis
app.post('/result', (req, res) => {
  const rollNumber = req.body.rollNumber;
  const student = studentData.find((s) => s['Roll No.'] === rollNumber);

  if (student) {
    const result = {
      name: student.Name,
      rollNumber: student['Roll No.'],
      sgpa: parseFloat(student.SGPA)
    };
    res.json(result);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Route to handle searching for students by name
app.post('/search', (req, res) => {
  const searchName = req.body.searchName.toLowerCase();
  const matchingStudents = studentData.filter((student) =>
    student.Name.toLowerCase().includes(searchName)
  );

  if (matchingStudents.length > 0) {
    res.json(matchingStudents);
  } else {
    res.status(404).json({ error: 'No students found with the given name.' });
  }
});