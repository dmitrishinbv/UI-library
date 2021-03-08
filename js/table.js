import {createHtmlElement} from "./main.js";
import {showModalWindow} from "./modal.js";
import {closeModalWindow} from "./modal.js";

const sortButtonsIcons = ["fa-sort", "fa-sort-alpha-up", "fa-sort-alpha-down"];
const sortButtonsIconsNumeric = ["fa-sort", "fa-sort-numeric-up-alt", "fa-sort-numeric-down-alt"];
const SIZE_INPUT_TEXT = 40; // visible size for form input with type text
const SIZE_INPUT_URL = 70; // visible size for form input with type url
const USER_MODAL_WINDOW_ID = "#send3";
const NOTIFICATION_TIMEOUT = 2000;
let findData = []; //accumulates data search results from user query
let columnSortStates = []; //accumulates sort states (default - 0, sort up - 1, sort down - 2) for each table column
let userData = []; // accumulates update data from server api or local resource
let localMode = false; // works only with local data

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
        {title: 'Действия', type: 'actions', editable: false},
    ],
    search: {
        fields: ['name', 'surname'],
        filters: [
            v => v.toLowerCase(),
            v => toKeyboardLayout(v.toLowerCase())
        ]
    },
    apiURL: "https://60461bd1f0c6dc00177b158d.mockapi.io/api/ps5/student"
};


const data = [
    {
        "id": "1", "createdAt": "2020-05-31T19:24:58.692Z", "name": "Mariano",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/diesellaws/128.jpg", "surname": "Crona",
        "birthday": "2020-03-11"
    },
    {
        "id": "4", "createdAt": "2020-05-26T14:12:38.295Z", "name": "Branson",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/justinrob/128.jpg", "surname": "Harber",
        "birthday": "2019-07-20T09:03:51.257Z"
    },
    {
        "id": "11", "createdAt": "2020-05-26T11:06:17.542Z", "name": "Robert",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/sreejithexp/128.jpg", "surname": "Kuhlman",
        "birthday": "2019-09-09T12:57:35.976Z"
    },
    {
        "id": "12", "createdAt": "2020-05-26T14:56:30.258Z", "name": "Carmen",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/toddrew/128.jpg", "surname": "Hirthe",
        "birthday": "2019-07-28T05:04:03.988Z"
    },
    {
        "id": "15", "createdAt": "2020-05-26T14:56:30.258Z", "name": "Carmen",
        "avatar": "", "surname": "Hirthe",
        "birthday": "2019-07-28T05:04:03.988Z"
    }
];

const notification = {
    "notification-success-form": "Отправляю данные на сервер...",
    "notification-error-form": "Исправьте все ошибки в форме и попробуйте ещё раз",
    "notification-success-request": "Успешно",
    "notification-error-request": "Ошибка! Не удалось записать данные на сервер"
};

// week #5
//DataTable(config1, data); // used for local mode
DataTable(config1);

async function DataTable(config, data) {
    createOpenFormBtn(config);

    if (data) {
        localMode = true;
        userData = (userData.length) ? userData : data;
    }

    const buildData = await getData(config.apiURL);
    userData = buildData.slice();

    if (config.search) {
        addSearchFiled(config, buildData);
    }

    const table = document.createElement("table");
    document.querySelector(config.parent).appendChild(table);
    table.appendChild(addHeader(config)); // add column names to the table head
    addSortBtns(config, table, buildData); // add sort buttons to the table head
    renderTable(config, buildData); // build table data rows
}

async function getData(url) {
    if (localMode) {
        return userData;

    } else if (url) {
        try {
            let response = await fetch(url, {method: "GET"});
            if (response.status !== 200) {
                alert("Ну удалось получить данные с сервера! Ошибка " + response.status);
            }
            return await response.json();

        } catch (error) {
            alert("Ну удалось получить данные с сервера " + error.message);
        }

    } else {
        alert("Not found apiURL or local stored data");
    }
}


async function sendRequest(config, url, method, id, form) {
    if (localMode) {
        updateLocalData(config, method.toLowerCase(), id, form);

    } else {
        method = method.toLowerCase();
        let json;
        let headers;

        if (method === "post" || method === "put") {
            const formData = new FormData(form);
            json = JSON.stringify(Object.fromEntries(formData));
            headers = {
                "Content-Type": "application/json"
            };
        }

        try {
            let response = await fetch(url, {
                method: method,
                body: json,
                headers: headers
            });

            response = await response.json();
            (response)
                ? displayNotification('notification-success-request')
                : displayNotification('notification-error-request')

        } catch (error) {
            console.error(error);
            displayNotification('notification-error-request');
        }

        userData = await getData(config.apiURL);
    }

    rebuildTable(config);
}


function updateLocalData(config, method, id, form) {
    let data = {};

    if (form) {
        config.columns.forEach((column) => {
            if (column.editable !== false) {
                data[column.value] = form.querySelector("#" + column.value).value;
            }

            if (column.value === "createdAt") {
                data[column.value] = new Date().toISOString();
            }
        });
    }


    if (method === "post") {
        let id = Math.max(...userData.map(item => item.id));
        data.id = ++id;
        userData.push(data);
    }

    if (method === "put") {
        Object.assign(userData.find(item => item.id === id), data);
    }

    if (method === "delete") {
        userData = userData.filter(dataRow => dataRow.id !== id);
    }

    rebuildTable(config);
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


function renderTable(config, data) {
    const table = document.querySelector(config.parent + " table");
    const tbody = createHtmlElement("tbody", table);
    let index = 0;

    data.forEach((dataRow) => {
        tbody.appendChild(buildTableDataRows(config, dataRow, ++index));
    });

    table.appendChild(tbody);
    setTimeout(clearNotifications, NOTIFICATION_TIMEOUT);

    return table;
}


function buildTableDataRows(config, dataRow, index) {
    const tr = document.createElement("tr");

    config.columns.forEach(function (column) {
        createElementByColumnType(config, tr, column, dataRow, index);
    });

    return tr;
}


function createElementByColumnType(config, tr, column, dataRow, index) {
    let innerHtml = dataRow[column.value];
    let td;
    let element;
    let date;

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
            date = new Date(innerHtml);
            const options = {year: 'numeric', month: 'long', day: 'numeric'};
            date = date.toLocaleDateString('ru-RU', options);
            element = createHtmlElement("td", tr, date, null, "align-right");
            break;

        case "age" :
            const key = column.value;
            innerHtml = key(dataRow);
            element = createHtmlElement("td", tr, innerHtml, null, "align-right");
            break;

        case "actions" :
            let btnArr = [];
            element = createHtmlElement("td", tr, null, null, null);
            const div = createHtmlElement("div", element,
                null, null, "mybtn-col-group");
            btnArr.push(createHtmlElement("button", div, "Удалить",
                null, "mybtn-danger"));
            btnArr.push(createHtmlElement("button", div, "Редактировать",
                null, "mybtn-warning"));
            addActions(config, dataRow, btnArr);
            break;

        default :
            element = createHtmlElement("td", tr, innerHtml, null, null);
    }
}


function addActions(config, dataRow, btnArr) {
    const delBtn = btnArr[0];
    const editBtn = btnArr[1];

    delBtn.onclick = async () => {
        if (confirm("Удалить?")) {
            await sendRequest(config, config.apiURL + "/" + dataRow.id, "DELETE", dataRow.id);
        }
    };

    editBtn.onclick = () => {
        editUser(config, dataRow);
    };
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

                // if (columnSortStates[i] === 1) {
                //     sortData = sortColumn(column, 1, sortData); // data in column will be sort up
                // }
                //
                // if (columnSortStates[i] === 2) {
                //     sortData = sortColumn(column, -1, sortData); // data in column will be sort down
                // }
                //
                // if (columnSortStates[i] === 0 && (!columnSortStates.includes(1) || !columnSortStates.includes(2))) {
                //     sortData = data; // data in column will be set to default values
                // }

                rebuildTable(config);
            };
        }
    });
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


function rebuildTable(config) {
    const table = document.querySelector(config.parent + " table");
    table.querySelector(" tbody").remove();

    const searchQuery = document.querySelector("#searchQuery").value;
    let newData;

    if (searchQuery !== "") {
        findData = initSearch(config, searchQuery);
        newData = findData;

    } else {
        findData = [];
        newData = userData;
    }

    newData = sortData(config, newData);
    renderTable(config, newData);
}

function sortData(config, newData) {
    let sortedColumn = [];

    columnSortStates.filter((column, index, array) => {
        if (column > 0) sortedColumn.push(index, column);
    });

    if (sortedColumn.length) {
        const sortCoef = (sortedColumn[1] === 1) ? 1 : -1;
        newData = sortColumn(config.columns[sortedColumn[0]], sortCoef, newData);
    }

    return newData;
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


function addSearchFiled(config) {
    const tableContainer = document.querySelector(config.parent);
    const searchContainer = createHtmlElement("div", tableContainer, null,
        null, "table-search");
    const searchInput = createHtmlElement("input", searchContainer, null,
        new Map([["id", "searchQuery"], ["type", "text"], ["placeholder", "search"]]), null);
    searchInput.focus();

    searchInput.oninput = () => {
        rebuildTable(config);
    };
}


function initSearch(config, query) {
    // check config columns for "search" and "fields"
    if (config.search && config.search.fields && config.search.fields.length > 0) {
        return findData = searchData(config, config.search.fields, query);

    } else {
        return findData = searchData(config, null, query);
    }
}


function searchData(config, fields, query) {
    // if no columns for search in function arguments to searchFields will be included all config' columns
    const searchFields = (fields != null) ? fields : config.columns.map(item => item.value);
    const inputFilters = (config.search && config.search.filters) ? config.search.filters : [(v => v)];

    return userData.filter(el => {
        return searchFields.filter(columnName => {
            return inputFilters.filter(
                currentFilter => currentFilter(el[columnName] + "").indexOf(currentFilter(query)) !== -1).length;
        }).length;
    });
}


function prepareModalWindow() {
    const modalHeader = document.querySelector(USER_MODAL_WINDOW_ID + " .modal-header");

    while (modalHeader.firstChild) {
        modalHeader.removeChild(modalHeader.firstChild);
    }

    createHtmlElement("h3", modalHeader, "Добавить пользователя на сайт");
    const modalFooter = document.querySelector(USER_MODAL_WINDOW_ID + " .add-user-modal-footer");

    while (modalFooter.firstChild) {
        modalFooter.removeChild(modalFooter.firstChild);
    }

    const btnRowContainer = createHtmlElement("div", modalFooter, null,
        null, "mybtn-row-group add-user-btns");

    createHtmlElement("button", btnRowContainer, "Отправить",
        new Map([["type", "submit"]]), "mybtn-success modal-send-btn");

    const cancelBtn = createHtmlElement("button", btnRowContainer, "Отменить",
        new Map([["id", "modalCancelBtn"]]), "mybtn-danger");

    cancelBtn.onclick = () => {
        closeModalWindow(document.querySelector(USER_MODAL_WINDOW_ID));
    };

}


function createOpenFormBtn(config) {
    const tableContainer = document.querySelector(config.parent);
    let openFormBtn = document.querySelector("#openForm");
    const modal = document.querySelector(USER_MODAL_WINDOW_ID);

    if (openFormBtn === null) {
        openFormBtn = createHtmlElement("button", tableContainer, "Добавить",
            new Map([["id", "openForm"]]), "mybtn-primary border-round-5 add-btn modal-trigger");
    }

    openFormBtn.onclick = () => {
        removeForm();
        prepareModalWindow();
        addForm(config);
        clearNotifications();
        showModalWindow(modal);
        document.querySelector(USER_MODAL_WINDOW_ID + " form input").focus();
    };
}


function addForm(config) {
    const modalContainer = document.querySelector(USER_MODAL_WINDOW_ID + " .modal-content");
    modalContainer.classList.add("container");
    const form = createHtmlElement("form", modalContainer, null,
        new Map([["id", "userInfo"],
            ["method", "post"],
            ["enctype", "multipart/form-data"]]), null);

    let hasImg = false;

    config.columns.forEach((column) => {
        let type = "text";
        let size = SIZE_INPUT_TEXT;
        let placeholder = column.title;
        let required = ["required", ""];

        if (column.editable !== false) {
            if (column.type === 'datetime-local') {
                type = "date";
                size = "";
            }

            if (column.type === 'url-jpg') {
                hasImg = true;
                type = "url";
                placeholder = "введите url адрес изображения для аватарки";
                required = [];
                size = SIZE_INPUT_URL;
            }

            createHtmlElement("label", form, column.title, new Map([["for", column.value]]), null);

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

    const form = document.querySelector("#userInfo");
    const sendBtn = document.querySelector(".modal-send-btn");

    sendBtn.onclick = async () => {
        if (form.reportValidity()) {
            displayNotification('notification-success-form');
            await sendRequest(config, config.apiURL, "POST", null, form);
            form.querySelector(".user-img").setAttribute("src", "");
            form.reset();
            form.querySelector("input").focus();

        } else {
            displayNotification('notification-error-form');
        }
    }
}


function clearNotifications() {
    const container = document.querySelector('#notifications');

    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}


function editUser(config, dataRow) {
    prepareModalWindow();
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

    let data = new FormData(form);
    data.set(data.createdAt, new Date().toISOString());
    const modal = document.querySelector(USER_MODAL_WINDOW_ID);

    showModalWindow(modal);

    sendBtn.onclick = () => {
        if (form.reportValidity()) {
            displayNotification('notification-success-form');
            sendRequest(config, config.apiURL + "/" + dataRow.id, "PUT", dataRow.id, form);

        } else {
            displayNotification('notification-error-form');
        }
    }
}


function displayNotification(messageClass) {
    const notifyContainer = document.querySelector("#notifications");
    createHtmlElement("div", notifyContainer, notification[messageClass], null, messageClass);
}


function removeForm() {
    const form = document.querySelector(USER_MODAL_WINDOW_ID + " .modal-content form");

    if (form) {
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

    return (age < 1) ? "менее 1 года" : Math.trunc(age);
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
