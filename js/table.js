import {createHtmlElement} from "./main.js";

const sortButtonsIcons = ["fa-sort", "fa-sort-alpha-up", "fa-sort-alpha-down"];
const sortButtonsIconsNumeric = ["fa-sort", "fa-sort-numeric-up-alt", "fa-sort-numeric-down-alt"];
const SIZE_INPUT_TEXT = 40; // visible size for form input with type text
const SIZE_INPUT_URL = 70; // visible size for form input with type url
const USER_MODAL_WINDOW_ID = "#send3";
let findData = []; //accumulates data search results from user query
let columnSortStates = []; //accumulates sort states (default - 0, sort up - 1, sort down - 2) for each table column


// week #5 config file
const config1 = {
    parent: '#usersTable',
    columns: [
        {title: '№', value: '_index', type: 'counter', editable: false},
        {title: 'Дата создания', value: 'createdAt', type: 'datetime-local', sortable: true, editable: false},
        {title: 'Имя', value: 'name', sortable: true},
        {title: 'Фамилия', value: 'surname', sortable: true},
        {title: 'Аватар', value: 'avatar', type: 'url-jpg'},
        {title: 'Дата рождения', value: 'birthday', type: 'datetime-local', sortable: true},
        {title: 'Возраст', value: (user) => calculateAge(user.birthday), type: 'age', editable: false},
        {title: 'Действия', value: 'actions', type: 'buttons', editable: false},
    ],
    search: {
        fields: ['name', 'surname'],
        filters: [
            v => v.toLowerCase(),
            v => toKeyboardLayout(v.toLowerCase())
        ]
    },
    apiURL: "https://5e938231c7393c0016de48e6.mockapi.io/api/ps5/student"
};

// week #5
DataTable(config1);


async function DataTable(config, data) {
    if (!data && config.apiURL) {
        prepareModalWindow(config);
        data = await getDataFromApi(config.apiURL, "GET");
    }

    if (config.search) {
        addSearchFiled(config, data);
    }

    const table = document.createElement("table");
    document.querySelector(config.parent).appendChild(table);
    table.appendChild(addHeader(config)); // add column names to the table head
    addSortBtns(config, table, data); // add sort buttons to the table head
    renderTable(table, data, config);
}

async function getDataFromApi(url, method) {
    try {
        let response = await fetch(url, {method: method});
        return await response.json();

    } catch (error) {
        throw new Error("Не удалось получить данные от сервера");
    }
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
        createElementByColumnType(tr, column, dataRow, index, config);
    });

    return tr;
}


function createElementByColumnType(tr, column, dataRow, index, config) {
    let innerHtml = dataRow[column.value];
    let date = new Date(innerHtml);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    date = date.toLocaleDateString('ru-RU', options);
    let td;
    let element;

    switch (column.type) {
        case "counter" :
            element = createHtmlElement("td", tr, index, null, "align-center");
            break;

        case "url-jpg" :
            td = createHtmlElement("td", tr, null, null, "align-center");
            element = createHtmlElement("img", td, null, new Map([["src", innerHtml]]),
                "avatar-img");
            break;

        case "datetime-local" :
            element = createHtmlElement("td", tr, date, null, "align-right");
            break;

        case "age" :
            const key = column.value;
            innerHtml = key(dataRow);
            element = createHtmlElement("td", tr, innerHtml, null, "align-right");
            break;

        case "buttons" :
            element = createHtmlElement("td", tr, null, null, null);
            const div = createHtmlElement("div", element,
                null, null, "mybtn-col-group");
            const delBtn = createHtmlElement("button", div, "Удалить",
                null, "mybtn-danger");

            delBtn.onclick = () => {
                if (confirm("Удалить?")) deleteUser(dataRow.id, config);
            };
            const editBtn = createHtmlElement("button", div, "Редактировать",
                null, "mybtn-warning");

            editBtn.onclick = () => {
                editUser(dataRow, config);
            };
            break;

        case "number" :
            element = createHtmlElement("td", tr, date, null, "align-right");
            break;

        default :
            element = createHtmlElement("td", tr, innerHtml, null, null);
    }

    return element
}


function addSortBtns(config, table, data) {
    config.columns.forEach(function (column, i) {
        const th = table.querySelectorAll("th");
        columnSortStates.push(0); // 0 - default sort state fo each table column

        if (column.sortable === true) {
            const btn = createHtmlElement("i", th[i], null, new Map([["id", i]]),
                "fas " + sortButtonsIcons[0]);

            btn.onclick = () => {
                let sortData = (findData.length) ? findData : data.slice();
                data = (findData.length) ? findData : data;

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
    table.querySelector(" tbody").remove();
    let sortedColumn = [];

    columnSortStates.filter((column, index, array) => {
        if (column > 0) sortedColumn.push(index, column);
    });

    if (sortedColumn.length) {
        const sortCoef = (sortedColumn[1] === 1) ? 1 : -1;
        sortColumn(config.columns[sortedColumn[0]], sortCoef, sortData);
    }

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
            (config.columns[columnIndex].type === "number")
                ? btnClasses.add(sortButtonsIconsNumeric[newState])
                : btnClasses.add(sortButtonsIcons[newState]);
        }
    });

    // changes not current column sort-state to default value (0)
    columnSortStates.forEach((column, index) => {
        if (index !== columnIndex && column > 0) {
            columnSortStates[index] = 0;
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
    const tableContainer = document.querySelector(config.parent);
    const searchContainer = createHtmlElement("div", tableContainer, null,
        null, "table-search");
    const searchInput = createHtmlElement("input", searchContainer, null,
        new Map([["type", "text"], ["placeholder", "search"]]), null);
    let searchResult = [];
    searchInput.focus();

    searchInput.oninput = () => {
        const table = document.querySelector(config.parent + " table");

        (searchInput.value !== "")
            ? searchResult = initSearch(table, config, data, searchInput.value)
            : rebuildTable(table, data, config);
    };
}


function initSearch(table, config, data, query) {
    let searchResult;

    // check config columns for "search" and "fields"
    if (config.search && config.search.fields && config.search.fields.length > 0) {
        searchResult = searchData(config, config.search.fields, data, query);

    } else {
        searchResult = searchData(config, null, data, query);
    }

    findData = searchResult;
    rebuildTable(table, searchResult, config);
}


function searchData(config, fields, data, query) {
    // if no columns for search in function arguments to searchFields will be included all config' columns
    const searchFields = (fields != null) ? fields : config.columns.map(item => item.value);
    const inputFilters = (config.search && config.search.filters) ? config.search.filters : [(v => v)];

    return data.filter(el => {
        return searchFields.filter(columnName => {
            return inputFilters.filter(
                currentFilter => currentFilter(el[columnName] + "").indexOf(currentFilter(query)) !== -1).length;
        }).length;
    });
}


async function deleteUser(id, config) {
    let data;

    if (config.apiURL) {
        data = await getDataFromApi(config.apiURL + "/" + id, "DELETE");

        if (data.length) {
            throw new Error("Not found");
        }

    } else {
        throw new Error("Ошибка. Сonfig не содержит apiURL для отправки запроса");
    }

    let changedData = await getDataFromApi(config.apiURL, "GET");
    const table = document.querySelector(config.parent + " table");
    rebuildTable(table, changedData, config);
}


function prepareModalWindow(config) {
    const modalHeader = document.querySelector(USER_MODAL_WINDOW_ID + " .modal-header");

    while (modalHeader.firstChild) {
        modalHeader.removeChild(modalHeader.firstChild);
    }

    const h3 = createHtmlElement("h3", modalHeader, "Добавить пользователя на ");
    createHtmlElement("a", h3, config.apiURL,
        new Map([["href", config.apiURL], ["target", "_blanc"]]));

    const modalFooter = document.querySelector(USER_MODAL_WINDOW_ID + " .add-user-modal-footer");

    while (modalFooter.firstChild) {
        modalFooter.removeChild(modalFooter.firstChild);
    }

    const btnRowContainer = createHtmlElement("div", modalFooter, null,
        null, "mybtn-row-group add-user-btns");

    createHtmlElement("button", btnRowContainer, "Отправить",
        new Map([["type", "submit"]]), "mybtn-success modal-send-btn");

    createHtmlElement("button", btnRowContainer, "Cancel",
        new Map([["id", "modalCancelBtn"]]), "mybtn-danger");

    createOpenFormBtn(config);
}


function createOpenFormBtn(config) {
    const tableContainer = document.querySelector(config.parent);
    let openFormBtn = document.querySelector("#openForm");

    if (openFormBtn === null) {
        openFormBtn = createHtmlElement("button", tableContainer, "Добавить",
            new Map([["id", "openForm"]]), "mybtn-primary border-round-5 add-btn");
    }

    openFormBtn.onclick = () => {
        removeForm();
        prepareModalWindow(config);
        addForm(config);
        showModal();
    };
}


function addForm(config) {
    const modalContainer = document.querySelector(USER_MODAL_WINDOW_ID + " .modal-content");
    modalContainer.classList.add("container");
    const form = createHtmlElement("form", modalContainer, null,
        new Map([["id", "userForm"],
            ["method", "post"],
            ["enctype", "multipart/form-data"]]), null);

    let hasImg = false;

    config.columns.forEach((column) => {
        let type = "text";
        let size = SIZE_INPUT_TEXT;
        let placeholder = column.title;
        let required = ["required", ""];
        let label = false;

        if (column.editable !== false) {
            if (column.type === 'datetime-local') {
                type = "date";
                required = [];
                size = "";
                label = true;
            }

            if (column.type === 'url-jpg') {
                hasImg = true;
                type = "url";
                placeholder = "введите url адрес изображения для аватарки";
                required = [];
                size = SIZE_INPUT_URL;
            }

            if (label) {
                createHtmlElement("label", form, column.title, null, null);
            }

            createHtmlElement("input", form, null,
                new Map([["id", column.value],
                    ["name", column.value],
                    ["placeholder", placeholder],
                    ["size", size],
                    ["type", type],
                    required]), "form-control");
        }
    });

    if (hasImg) {
        const imgContainer = createHtmlElement("div", form, null,
            null, "form-img-container");
        createHtmlElement("img", imgContainer, null,
            new Map([["src", ""]]), "user-img");
    }

    createHtmlElement("button", form, "Ввести всё заново",
        new Map([["type", "reset"], ["form", form.id]]), "mybtn-secondary border-round-5");

    addFormActions(config, hasImg);

    return form;
}


function addFormActions(config, hasImg) {
    if (hasImg) {
        const imgInput = document.querySelector(USER_MODAL_WINDOW_ID + " [type=url]");

        imgInput.onchange = () => {
            const img = document.querySelector(USER_MODAL_WINDOW_ID + " .form-img-container img");
            img.setAttribute("src", imgInput.value);
        };
    }

    const cancelBtn = document.querySelector("#modalCancelBtn");

    cancelBtn.onclick = () => {
        document.querySelector(USER_MODAL_WINDOW_ID).classList.remove("modal-active");
        document.querySelector(USER_MODAL_WINDOW_ID).classList.add("modal-hidden");
    };

    const sendBtn = document.querySelector(".modal-send-btn");

    sendBtn.onclick = () => {
        if (document.forms[0].reportValidity()) {
            displayNotification('notification-success');
            sendFormData(document.forms[0], config, config.apiURL, "POST");

        } else {
            displayNotification('notification-error');
        }
    }
}


function showModal() {
    clearNotifications();
    document.querySelector(USER_MODAL_WINDOW_ID).classList.remove("modal-hidden");
    document.querySelector(USER_MODAL_WINDOW_ID).classList.add("modal-active");
    document.querySelector(USER_MODAL_WINDOW_ID + " form input").focus();
}


function clearNotifications() {
    const container = document.querySelector('#notifications');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}


function editUser(dataRow, config) {
    document.querySelector(USER_MODAL_WINDOW_ID + " .modal-header h3").innerHTML
        = "Редактировать пользователя (id " + dataRow.id + ")";
    const sendBtn = document.querySelector(USER_MODAL_WINDOW_ID + " .modal-send-btn");
    sendBtn.innerHTML = "Сохранить";

    removeForm();
    const form = addForm(config);
    document.querySelector(USER_MODAL_WINDOW_ID + " [type=reset]").innerHTML = "Вернуть как было";

    const inputElements = form.querySelectorAll("input");
    inputElements.forEach(el => {

        let currentVal = dataRow[el.id];
        if (el.type === "date") {
            currentVal = new Date(dataRow[el.id]).toISOString().slice(0, 10);
        }
        if (el.type === "url") {
            form.querySelector(".user-img").setAttribute("src", currentVal);
        }

        el.setAttribute("value", currentVal);
    });

    showModal();

    const url = config.apiURL + "/" + dataRow.id;
    sendBtn.onclick = () => {
        if (form.reportValidity()) {
            displayNotification('notification-success');
            sendFormData(form, config, url, "PUT");

        } else {
            displayNotification('notification-error');
        }
    }
}


async function sendFormData(form, config, url, method) {
    let data = {};

    config.columns.forEach((column) => {
        if (column.editable !== false) {
            data[column.value] = form.querySelector("#" + column.value).value;
        }

        if (column.value === "createdAt") {
            data[column.value] = new Date().toISOString();
        }
    });

    try {
        await fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        displayNotification('notification-success-res');

    } catch (error) {
        console.error(error);
        displayNotification('notification-error-res');
    }

    let changedData = await getDataFromApi(config.apiURL, "GET");
    const table = document.querySelector(config.parent + " table");
    rebuildTable(table, changedData, config);
    setTimeout(clearNotifications, 1000);
}


function displayNotification(messageClass) {
    let msgContainer;
    document.querySelector("#notifications").appendChild(
        msgContainer = document.createElement('div'));

    msgContainer.classList.add(messageClass);

}


function removeForm() {
    const form = document.querySelector(USER_MODAL_WINDOW_ID + " .modal-content form");

    if (form) {
        while (form.firstChild) {
            form.removeChild(form.firstChild);
        }
        form.remove();
    }
}


function calculateAge(birthday) {
    const currentDate = new Date();
    const birthdayYear = new Date(birthday).getFullYear();
    const birthdayMonth = new Date(birthday).getMonth();
    const birthdayDay = new Date(birthday).getDate();
    let age = currentDate.getFullYear() - birthdayYear + (currentDate.getMonth() - birthdayMonth) / 12 +
        (currentDate.getDate() - birthdayDay) / 365;
    return Math.round(age * 100) / 100;
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
// const config1 = {
//     parent: '#usersTable',
//     columns: [
//         {title: '№', value: '_index'},
//         {title: 'Имя', value: 'name'},
//         {title: 'Фамилия', value: 'surname', sortable: true},
//         {title: 'Возраст', value: 'age', type: 'number', sortable: true},
//     ],
//     search: {
//         fields: ['name', 'surname'],
//         filters: [
//             v => v.toLowerCase(),
//             v => toKeyboardLayout(v.toLowerCase())
//         ]
//     }
// };

// used for tests week #4
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

// const users = [
//     {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
//     {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
//     {id: 30052, name: 'Коля', surname: 'Мастер', age: 23},
//     {id: 30053, name: 'Вадик', surname: 'Боцман', age: 11},
// ];

// week #4
//DataTable(config1, users);