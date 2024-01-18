const fileInput = document.getElementById('fileInput');
const logSection = document.getElementById('logSection');

const checkBtn = document.getElementById('check-file');
const toggleLogsBtn = document.getElementById('toggle-logs');
const clearLogsBtn = document.getElementById('clear-logs');

checkBtn.addEventListener('click', checkFiles);
toggleLogsBtn.addEventListener('click', toggleLogs);
clearLogsBtn.addEventListener('click', clearLogs);


async function checkFiles() {
    // Clear previous logs
    logSection.innerHTML = '';

    const assignmentFile = document.getElementById('assignmentFileInput').files[0];
    const actualFile = document.getElementById('actualFileInput').files[0];

    if (assignmentFile && actualFile) {
        try {
            const data = await sendFilesToServer(assignmentFile, actualFile);
            let isFirstTitle = true;
            // console.log(data);
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const arrayData = data[key];

                    // Create a container div for each title and its content
                    const container = document.createElement('div');
                    container.className = 'logContainer';

                    // Add horizontal line above the title (skip for the first one)
                    if (!isFirstTitle) {
                        container.classList.add('separator');
                    } else {
                        isFirstTitle = false;
                    }

                    // Create a title for the key with styling
                    const title = document.createElement('div');
                    title.className = 'logTitle';
                    title.textContent = key;
                    container.appendChild(title);

                    // Create an unordered list for the array data
                    const ul = document.createElement('ul');
                    // Iterating over the array data and create list items with bullets
                    if (Array.isArray(arrayData) && arrayData.length > 0) {
                        arrayData.forEach(function(item) {
                            const container = document.createElement('div');
                            container.className = 'list-item-container';

                            // Create an error icon using a red "x" Unicode character
                            const errorIcon = document.createElement('span');
                            errorIcon.className = 'text-danger me-2';
                            errorIcon.textContent = '❌'; // Unicode character for "x"
                            container.appendChild(errorIcon);

                            // Create the actual list item
                            const li = document.createElement('li');
                            li.innerHTML = item;

                            container.appendChild(li);

                            ul.appendChild(container);

                        });
                    } else {
                        const li = document.createElement('li');
                        li.textContent = "No issues found";
                        ul.appendChild(li);
                    }
                    container.appendChild(ul);

                    logSection.appendChild(container);
                }
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        logSection.innerHTML = '<div class="logMessage">Please select both assignment and actual .twbx files.</div>';
    }
    if (logSection.style.display === 'none' || logSection.style.display === '') {
        logSection.style.display = 'block' ;
    }
}



function toggleLogs() {
    const logSection = document.getElementById('logSection');
    if (logSection) {
        logSection.style.display = (logSection.style.display === 'none' || logSection.style.display === '') ? 'block' : 'none';
    } else {
        console.error('logSection not found or does not have a style property.');
    }
}

async function sendFilesToServer(assignmentFile, actualFile) {
    var formData = new FormData();
    formData.append('assignmentFile', assignmentFile);
    formData.append('actualFile', actualFile);

    const res = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .catch(err => console.error('Error: ' + err.message));



    return res;
}

function clearLogs() {
    logSection.innerHTML = '';
}