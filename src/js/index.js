let processedData = [];

function changeRecord(index, key, value) {
    processedData[index][key] = value;
    renderTable();
}

function parseCsv() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const csvData = event.target.result;
            Papa.parse(csvData, {
                header: true,
                complete: function (results) {
                    processedData = results.data;
                    renderTable();
                },
                error: function (error) {
                    console.error('Error parsing CSV:', error);
                }
            });
        };

        reader.readAsText(file);
    }
}

document.getElementById('fileInput').addEventListener('change', parseCsv);

function generateData() {
    processedData = [
        {
            id: 1,
            name: 'John',
            age: 25,
            city: 'New York'
        },
        {
            id: 2,
            name: 'Jane',
            age: 30,
            city: 'Los Angeles'
        },
        {
            id: 3,
            name: 'Bob',
            age: 35,
            city: 'Chicago'
        }
    ];
    renderTable();
}

document.getElementById('generateData').addEventListener('click', generateData);


function addRecord() {
    const emptyRecord = Object.keys(processedData[0]).reduce((acc, key) => ({...acc, [key]: ''}), {});
    processedData.push(emptyRecord);
    renderTable();
}

document.getElementById('addRecord').addEventListener('click', addRecord);


function saveData() {
    const csvHeader = Object.keys(processedData[0]).join(',');
    const csvData = processedData.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csvHeader + '\n' + csvData], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.click();
}

document.getElementById('saveData').addEventListener('click', saveData);

function displayError(message) {
    alert(message);
}

function renderTable() {
    if(processedData.length === 0) {
        displayError('No data to display');
        return;
    }
    if(processedData.some(item => item.hasOwnProperty("__parsed_extra"))) {
        displayError('Invalid CSV file');
        return;
    }

    const tableHeader = document.querySelector('thead');
    tableHeader.innerHTML = '';
    const tableHeaderRow = document.createElement('tr');
    tableHeaderRow.innerHTML = `<th class="p-2 text-left border-b">#</th>` + Object.keys(processedData[0]).map(key => `<th class="p-2 text-left border-b">${key}</th>`).join('');
    tableHeader.appendChild(tableHeaderRow);

    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    processedData.forEach((row, index) => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `<td class="p-2 border-b">${index}</td>` + Object.keys(row).map(key =>
            `<td class="p-2 border-b"><input type="text" value="${row[key]}" class="w-full p-1 border rounded" onchange="changeRecord(${index}, '${key}', this.value)"></td>`).join('');
        tableBody.appendChild(tableRow);
    });
}
