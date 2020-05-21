function DataTable(config, data) {
    let table = document.createElement("table");
    document.getElementById(config.parent.substr(1, config.parent.length)).appendChild(table);
    table.setAttribute("id", "table1");
    let n = table.appendChild(addHeader(table, config));
    console.log(n);
}

function addHeader (table, config) {
    let thead = document.createElement("thead");
    // table.appendChild(thead);
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let th;
    for (let i = 0; i < config.columns.length; i++) {
      th =  (config.columns[i].type === "number") ?
          createHtmlElement("th", tr, config.columns[i].title, null, "align-right") :
          createHtmlElement("th", tr, config.columns[i].title, null);
    }
    return thead;
}

function createHtmlElement (tagName, parent, innerText = null, tagArrAttr = null, tagClass = null) {
    let newTag = document.createElement (tagName);
    if (innerText !== null) {
        let text = document.createTextNode(innerText);
        newTag.appendChild(text);
    }

    if (tagArrAttr !== null) {
        tagArrAttr.forEach ((value, key, map) => {
            newTag.setAttribute(`${key}`, `${value}`);
        });
    }

    if (tagClass !== null) {
        newTag.className = tagClass;
    }

    (parent === null) ? document.appendChild (newTag) : parent.appendChild (newTag);

    return newTag;
}

const config1 = {
    parent: '#usersTable',
    columns: [
        {title: '№', value: '_index'},
        {title: 'Имя', value: 'name'},
        {title: 'Фамилия', value: 'surname'},
        {title: 'Возраст', value: 'age', type: 'number'},
    ]
};

const users = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
    {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
    {id: 30052, name: 'Коля', surname: 'Мастер', age: 23},
    {id: 30053, name: 'Вадик', surname: 'Боцман', age: 11},
];

DataTable(config1, users);
