import {createHtmlElement} from "./main.js";

const sortButtonsIcons = ["fa-sort", "fa-sort-alpha-up", "fa-sort-alpha-down"];
const sortButtonsIconsNumeric = ["fa-sort", "fa-sort-numeric-up-alt", "fa-sort-numeric-down-alt"];


function DataTable(config, data) {
    if (config.search) {
        addSearchFiled(config, data);
    }

    let sortData = data.slice();
    const table = document.createElement("table");
    document.querySelector(config.parent).appendChild(table);
    table.setAttribute("id", "table1");
    table.appendChild(addHeader(config)); // add column names to the table head
    addSortBtns(config, table, sortData, data); // add sort buttons to the table head
    renderTable(table, data, config);
}


function addHeader(config) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    thead.appendChild(tr);

    config.columns.forEach(column => {
        (column.type === "number") ?
            createHtmlElement("th", tr, column.title, null, "align-right") :
            createHtmlElement("th", tr, column.title, null, null);
    });

    return thead;
}


function renderTable(table, data, config) {
    const tbody = createHtmlElement("tbody", table);
    let index = 0;

    data.forEach((dataRow) => {
        tbody.appendChild(buildTableDataRows(config, dataRow, ++index));
    });

    table.appendChild(tbody);

    return table;
}


function buildTableDataRows(config, dataRow, index) {
    const tr = document.createElement("tr");

    config.columns.forEach(function (column) {
        let innerHtml = dataRow[column.value];

        if (column.value === "_index") {
            createHtmlElement("td", tr, index, null, "align-center");

        } else if (column.type === "number") {
            createHtmlElement("td", tr, innerHtml, null, "align-right");

        } else {
            createHtmlElement("td", tr, innerHtml, null, null);
        }
    });

    return tr;
}


function addSortBtns(config, table, sortData, data) {
    let columnSortStates = [];

    config.columns.forEach(function (column, i) {
        const th = table.querySelectorAll("th");
        columnSortStates.push(0); // 0 - default sort state fo each table column
        if (column.sortable === true) {
            const btn = createHtmlElement("i", th[i], null, new Map([["id", i]]),
                "fas " + sortButtonsIcons[0]);

            btn.onclick = () => {
                columnSortStates[i] = changeSortState(config, btn, i, columnSortStates[i]);

                if (columnSortStates[i] === 1) {
                    sortData = sortColumn(column, 1, sortData); // data in column will be sort up
                }

                if (columnSortStates[i] === 2) {
                    sortData = sortColumn(column, -1, sortData); // data in column will be sort down
                }

                if (columnSortStates[i] === 0 && (!columnSortStates.includes(1) || !columnSortStates.includes(2))) {
                    sortData = data; // data in column will be set to default values
                }

                rebuildTable(table, sortData, config);
            };
        }
    });

    return columnSortStates;
}


function sortColumn(columnData, coef, sortData) {
    if (columnData.type === "number") {
        sortData.sort(function (a, b) {
            return coef * (a[columnData.value] - b[columnData.value]);
        });

    } else {
        sortData.sort(function (a, b) {
            return coef * a[columnData.value].localeCompare(b[columnData.value]);
        });
    }

    return sortData;
}


function rebuildTable(table, sortData, config) {
    document.querySelector(config.parent + " tbody").remove();
    renderTable(table, sortData, config);
}


// return result: 0 - default, 1 - sort up, 2 - sort down
function changeSortState(config, btn, columnIndex, prevState) {
    let btnClasses = btn.classList;
    let newState = (prevState === 0 || prevState === 1) ? ++prevState : 0;

    // changes current sort-buttons classes for display the correct icon
    btnClasses.forEach(btnClass => {
        if (btnClass.includes("fa-")) {
            btnClasses.remove(btnClass);
            (config.columns[columnIndex].type === "number") ?
                btnClasses.add(sortButtonsIconsNumeric[newState]) : btnClasses.add(sortButtonsIcons[newState]);
        }
    });

    actualizeBtnStatuses(config, columnIndex);

    return newState;
}

//  changes not current sort-buttons classes for display the default (not-sorted) icons
function actualizeBtnStatuses(config, columnIndex) {
    const table = document.querySelector(config.parent);
    let sortBtnArr = table.querySelectorAll('thead i');

    [].forEach.call(sortBtnArr, (btn => {
        if (Number(btn.id) !== columnIndex) {
            btn.className = "fas " + sortButtonsIcons[0];
        }
    }));
}


function addSearchFiled(config, data) {
    const table = document.querySelector(config.parent);
    const div = createHtmlElement("div", table, null, null, "table-search");
    const search = createHtmlElement("input", div, null,
        new Map([["type", "text"], ["placeholder", "search"]]), null);

    search.oninput = () => {
        const table = document.querySelector(config.parent + " table");

        if (search.value !== "") {
            initSearch(table, config, data, search.value);

        } else {
            rebuildTable(table, data, config);
        }
    };
}


function initSearch(table, config, data, query) {
    let searchResult;

    // check config columns for "search" and "fields"
    if (Object.keys(config).includes("search") && Object.keys(config.search).includes("fields")
        && config.search.fields.length > 0) {
        searchResult = searchData(config, config.search.fields, data, query);

    } else {
        searchResult = searchData(config, null, data, query);
    }

    rebuildTable(table, searchResult, config);
}


function searchData(config, fields, data, query) {
    // if no columns for search in function arguments to searchFields will be included all config' columns
    const searchFields = (fields != null) ? fields : config.columns.map(item => item.value);

    // check config columns for "search" and "filters"
    const inputFilters = (Object.keys(config).includes("search") && Object.keys(config.search).includes("filters")) ?
        config.search.filters : [(v => v)];

    let searchResults = [];

    inputFilters.forEach(currentFilter => {
        searchFields.forEach(columnName => {
            let res = data.filter(
                el => (
                    (currentFilter(el[columnName] + "")).indexOf(currentFilter(query)) !== -1));
            // join all results in one array
            searchResults = (res.length !== 0) ? searchResults.concat(res) : searchResults;

        });
    });

    const uniqueSearchResults = new Set(searchResults); // accumulate only unique entries
    return [...uniqueSearchResults]; // this spread operator takes an array from set collection
}


function toKeyboardLayout(str) {
    let associativeArray = {
        "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г",
        "i": "ш", "o": "щ", "p": "з", "[": "х", "]": "ъ", "a": "ф", "s": "ы",
        "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д",
        ";": "ж", "'": "э", "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и",
        "n": "т", "m": "ь", ",": "б", ".": "ю", "/": "."
    };
    return str.replace(/[A-z/,.;\]\[]/g, function (x) {
        return x == x.toLowerCase() ? associativeArray[x] : associativeArray[x.toLowerCase()].toUpperCase();
    });
}


// week #4 config file
const config1 = {
    parent: '#usersTable',
    columns: [
        {title: '№', value: '_index'},
        {title: 'Имя', value: 'name'},
        {title: 'Фамилия', value: 'surname', sortable: true},
        {title: 'Возраст', value: 'age', type: 'number', sortable: true},
    ],
    search: {
        fields: ['name', 'surname'],
        filters: [
            v => v.toLowerCase(),
            v => toKeyboardLayout(v.toLowerCase())
        ]
    }
};

// used for tests
const config0 = {
    parent: '#usersTable',
    columns: [
        {title: '№', value: '_index'},
        {title: 'Имя', value: 'name', sortable: true},
        {title: 'Фамилия', value: 'surname'},
        {title: 'Возраст', value: 'age', type: 'number'},
    ],
    // search: {
    //     fields: true
    // }
};

const users = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
    {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
    {id: 30052, name: 'Коля', surname: 'Мастер', age: 23},
    {id: 30053, name: 'Вадик', surname: 'Боцман', age: 11},
];

// week #4
DataTable(config1, users);