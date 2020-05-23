import {createHtmlElement} from "./main.js";

const sortButtonsIcons = ["fa-sort", "fa-sort-up", "fa-sort-down"];
let columnSortStates = [];  // 0 - default, 1 - sort up, 2 - sort down


function DataTable(config, data) {
    let sortData = data.slice();
    let table = document.createElement("table");
    document.querySelector(config.parent).appendChild(table);
    table.setAttribute("id", "table1");
    table.appendChild(addHeader(config)); // add column names to the table head
    columnSortStates = addSortBtns(config, table, sortData, data); // add sort buttons to the table head
    renderTable(table, config, data);
}

function addHeader(config) {
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    thead.appendChild(tr);

    for (let i = 0; i < config.columns.length; i++) {
        (config.columns[i].type === "number") ?
            createHtmlElement("th", tr, config.columns[i].title, null, "align-right") :
            createHtmlElement("th", tr, config.columns[i].title, null, null);
    }

    return thead;
}


function renderTable(table, config, data) {
    let tbody = document.createElement("tbody");
    let index = 0;
    data.forEach((dataRow) => {
        tbody.appendChild(buildTableDataRows(config, dataRow, ++index));
    });

    table.appendChild(tbody);

    return table;
}


function buildTableDataRows(config, dataRow, index) {
    let tr = document.createElement("tr");

    for (let i = 0; i < config.columns.length; i++) {
        if (config.columns[i].value === "_index") {
            createHtmlElement("td", tr, index, null, "align-center");
            continue;
        }

        let innerHtml = dataRow[config.columns[i].value];

        (config.columns[i].type === "number") ?
            createHtmlElement("td", tr, innerHtml, null, "align-right") :
            createHtmlElement("td", tr, innerHtml, null, null);
    }

    return tr;
}

function addSortBtns(config, table, sortData, data) {
    let columnSortStates = [];

    for (let i = 0; i < config.columns.length; i++) {
        let th = table.querySelectorAll("th");
        columnSortStates.push(0);
        if (config.columns[i].sortable === true) {
            let btn = createHtmlElement("i", th[i], null, new Map([["id", i]]),
                "fas " + sortButtonsIcons[0]);

            btn.onclick = () => {
                columnSortStates[i] = changeSortState(config, btn, i);

                if (columnSortStates[i] === 1) {
                    sortData = sortColumn(config.columns[i], 1, sortData);
                }

                if (columnSortStates[i] === 2) {
                    sortData = sortColumn(config.columns[i], -1, sortData);
                }

                if (columnSortStates[i] === 0 && (!columnSortStates.includes(1) || !columnSortStates.includes(2))) {
                    sortData = data;
                }

                rebuildTable(table, sortData, config);
            };
        }
    }

    return columnSortStates;
}


function sortColumn(columnData, sortState, sortData) {
    if (columnData.type === "number") {
        sortData.sort(function (a, b) {
            return sortState * (a[columnData.value] - b[columnData.value]);
        });

    } else {
        sortData.sort(function (a, b) {
            return sortState * a[columnData.value].localeCompare(b[columnData.value]);
        });
    }

    return sortData;
}


function rebuildTable(table, sortData, config) {
    document.querySelector(config.parent + " tbody").remove();
    renderTable(table, config, sortData);
}


function changeSortState(config, btn, columnIndex) {
    let btnClasses = btn.classList;
    let prevState = columnSortStates[columnIndex];
    let newState = (prevState === 0 || prevState === 1) ? ++prevState : 0;

    for (let i = 0; i < btnClasses.length; i++) {
        if (btnClasses[i].includes("fa-")) {
            btnClasses.remove(btnClasses[i]);
            btnClasses.add(sortButtonsIcons[newState]);
            break;
        }
    }
    actualizeBtnStatuses(config, columnIndex);

    return newState;
}

function actualizeBtnStatuses(config, columnIndex) {
    const table = document.querySelector(config.parent);
    let sortBtnArr = table.querySelectorAll('thead i');

    [].forEach.call(sortBtnArr, (btn => {
        if (Number(btn.id) !== columnIndex) {
            btn.className = "fas " + sortButtonsIcons[0];
        }
    }));
}

const config1 = {
    parent: '#usersTable',
    columns: [
        {title: '№', value: '_index'},
        {title: 'Имя', value: 'name'},
        //      {title: 'Фамилия', value: 'surname'},
        {title: 'Фамилия', value: 'surname', sortable: true},
//        {title: 'Возраст', value: 'age', type: 'number'},
        {title: 'Возраст', value: 'age', type: 'number', sortable: true},
    ]
};

const users = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
    {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
    {id: 30052, name: 'Коля', surname: 'Мастер', age: 23},
    {id: 30053, name: 'Вадик', surname: 'Боцман', age: 11},
];

DataTable(config1, users);
