export function createHtmlElement(tagName, parent = null, innerText = null, tagMapAttr = null, tagClass = null) {
    let newTag = document.createElement(tagName);

    if (innerText !== null) {
        let text = document.createTextNode(innerText);
        newTag.appendChild(text);
    }

    if (tagMapAttr !== null) {
        tagMapAttr.forEach((value, key, map) => {
            newTag.setAttribute(`${key}`, `${value}`);
        });
    }

    if (tagClass !== null) {
        newTag.className = tagClass;
    }

    (parent === null) ? document.appendChild(newTag) : parent.appendChild(newTag);

    return newTag;
}