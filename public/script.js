const searchForm = document.getElementById('search-form');
const compareForm = document.getElementById('compare-form');
const searchResultsContainer = document.getElementById('search-results');
const comparisonContainer = document.getElementById('comparison-container');
const loadingMessage = '<p>Loading...</p>';

// Function to search for students by name
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchName = document.getElementById('search-name').value.trim().toLowerCase(); // Trim and convert to lowercase for case-insensitive search

  try {
    const response = await fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searchName })
    });

    if (response.ok) {
      const matchingStudents = await response.json();
      displaySearchResults(matchingStudents);
    } else {
      const error = await response.json();
      displayError(error.error);
    }
  } catch (error) {
    displayError('An error occurred while searching for students.');
    console.error('Error:', error);
  }
});

// Function to compare students
compareForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const compareNames = document.getElementById('compare-names').value.trim().toLowerCase(); // Trim and convert to lowercase for case-insensitive search
  const namesArray = compareNames.split(',').map(name => name.trim()); // Split names and trim whitespace

  try {
    const response = await fetch('/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ names: namesArray })
    });

    if (response.ok) {
      const comparisonData = await response.json();
      displayComparison(comparisonData);
    } else {
      const error = await response.json();
      displayError(error.error);
    }
  } catch (error) {
    displayError('An error occurred while comparing students.');
    console.error('Error:', error);
  }
});

// Function to display search results
function displaySearchResults(students) {
  const resultsList = document.createElement('ul');

  students.forEach((student) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${student.Name} (${student['Roll_No']})`;
    listItem.addEventListener('click', () => {
      displayStudentData(student); // Display student data when clicked
    });
    resultsList.appendChild(listItem);
  });

  searchResultsContainer.innerHTML = '';
  if (students.length > 0) {
    searchResultsContainer.appendChild(resultsList);
  } else {
    searchResultsContainer.innerHTML = '<p>No matching names found.</p>';
  }
}

// Function to display comparison data
function displayComparison(comparisonData) {
  comparisonContainer.innerHTML = '';

  comparisonData.forEach((studentData) => {
    const studentDiv = document.createElement('div');
    studentDiv.classList.add('student-comparison');

    const heading = document.createElement('h3');
    heading.textContent = `${studentData.name} (${studentData.rollNo})`;
    studentDiv.appendChild(heading);

    const semesterData = document.createElement('div');
    semesterData.classList.add('semester-data');

    for (const semester in studentData.semesters) {
      const semesterDiv = document.createElement('div');
      semesterDiv.innerHTML = `<h4>${semester}</h4>`;

      const semesterInfo = studentData.semesters[semester];
      for (const key in semesterInfo) {
        const p = document.createElement('p');
        p.textContent = `${key}: ${semesterInfo[key]}`;
        semesterDiv.appendChild(p);
      }

      semesterData.appendChild(semesterDiv);
    }

    studentDiv.appendChild(semesterData);
    comparisonContainer.appendChild(studentDiv);
  });
}

function displayStudentData(student) {
  const studentDiv = document.createElement('div');
  studentDiv.classList.add('student-data');
  // addStudentToChart(student);

  const heading = document.createElement('h3');
  heading.textContent = `${student.Name} (${student['Roll_No']})`;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    studentDiv.remove(); // Remove the student's data when the remove button is clicked
  });

  studentDiv.appendChild(heading);
  studentDiv.appendChild(removeButton);

  const semesterData = document.createElement('div');
  semesterData.classList.add('semester-data');

  for (const semester in student) {
    if (semester.startsWith('SEM_')) {
      const p = document.createElement('p');
      p.textContent = `${semester}: ${student[semester]}`;
      semesterData.appendChild(p);
    }
  }

  studentDiv.appendChild(semesterData);
  comparisonContainer.appendChild(studentDiv);
}

const chartCanvas = document.getElementById('chart');
const chartContext = chartCanvas.getContext('2d');

let chartData = {
  labels: [],
  datasets: []
};

function updateChart() {
  new Chart(chartContext, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function addStudentToChart(student) {
  const studentColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate a random color for each student

  const semesterGpaData = Object.values(student.semesters).map(semester => semester.gpa); // Extract GPA values

  chartData.labels = Object.keys(student.semesters); // Update labels if needed

  chartData.datasets.push({
    label: `${student.Name} (${student['Roll_No']})`,
    data: semesterGpaData,
    borderColor: studentColor,
    backgroundColor: studentColor,
    tension: 0.1
  });

  updateChart();
}

function removeStudentFromChart(student) {
  const studentIndex = chartData.datasets.findIndex(dataset => dataset.label === `${student.Name} (${student['Roll_No']})`);
  if (studentIndex !== -1) {
    chartData.datasets.splice(studentIndex, 1);
    updateChart();
  }
}

function displayError(message) {
  searchResultsContainer.innerHTML = `<p>${message}</p>`;
  comparisonContainer.innerHTML = '';
}

const clearAllButton = document.getElementById('clear-all');

clearAllButton.addEventListener('click', () => {
  comparisonContainer.innerHTML = ''; // Clear all students from the comparison container
});
