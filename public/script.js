const searchForm = document.getElementById('search-form');
const searchResultsContainer = document.getElementById('search-results');
const resultForm = document.getElementById('result-form');
const resultContainer = document.getElementById('result-container');
const loadingMessage = '<p>Loading...</p>';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchName = document.getElementById('search-name').value;

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

function displaySearchResults(students) {
  const resultsList = document.createElement('ul');

  students.forEach((student) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${student.Name} (${student['Roll No.']})`;
    listItem.addEventListener('click', () => {
      fetchAndDisplayResult(student['Roll No.']);
    });
    resultsList.appendChild(listItem);
  });

  searchResultsContainer.innerHTML = '';
  searchResultsContainer.appendChild(resultsList);
}

async function fetchAndDisplayResult(rollNumber) {
  resultContainer.innerHTML = loadingMessage;

  try {
    const response = await fetch('/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rollNumber })
    });

    if (response.ok) {
      const result = await response.json();
      displayResult(result);
    } else {
      const error = await response.json();
      displayError(error.error);
    }
  } catch (error) {
    displayError('An error occurred while fetching the result.');
    console.error('Error:', error);
  }
}

function displayResult(result) {
  if (result.error) {
    displayError(result.error);
  } else {
    const resultHTML = `
      <h2>Result for Roll Number: ${result.rollNumber}</h2>
      <p>Name: ${result.name}</p>
      <p>SGPA: ${result.sgpa}</p>
    `;
    resultContainer.innerHTML = resultHTML;
  }
}

function displayError(message) {
  resultContainer.innerHTML = `<p>${message}</p>`;
  searchResultsContainer.innerHTML = '';
}

resultForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const rollNumber = document.getElementById('roll-number').value;
  fetchAndDisplayResult(rollNumber);
});