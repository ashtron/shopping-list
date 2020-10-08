window.onload = () => {
    const airtableApiKey = config.AIRTABLE_API_KEY;
    const airtableApiUrl = `https://api.airtable.com/v0/appW7LfolPCsDiVXX/Table%201?api_key=${airtableApiKey}`;

    const shoppingList = document.getElementById("shopping-list");
    const itemInput = document.getElementById("item-input");
    const saveButton = document.getElementById("save-button");
    const reloadButton = document.getElementById("reload-button");

    saveButton.addEventListener("click", addItem);
    reloadButton.addEventListener("click", getItems);

    const items = [];

    getItems();
    
    function getItems() {
        shoppingList.innerHTML = "";

        axios.get(airtableApiUrl)
            .then(response => {
                response.data.records.forEach(item => {
                    items.push(new shoppingListItem(item.id, item.fields.item));

                    let newItemElement = createItemElement(item.fields.item);

                    shoppingList.append(newItemElement);
                });
            });
    }

    function removeItem(itemElement) {
        const item = items.find(item => {
            return item.item === itemElement.innerText;
        });

        axios.delete(`https://api.airtable.com/v0/appW7LfolPCsDiVXX/Table%201/${item.id}?api_key=${airtableApiKey}`);
    }

    function addItem(event) {
        const newItem = itemInput.value;

        axios.post(airtableApiUrl, {
                "fields": {
                    "item": newItem
                }
            })
            .then(response => {
                items.push(new shoppingListItem(response.data.id, response.data.fields.item));
                shoppingList.append(createItemElement(newItem));
            });
    }

    function createItemElement(item) {
        const newItem = document.createElement("li");

        newItem.classList.add("shopping-list-item");
        newItem.innerText = item;

        newItem.addEventListener("click", (event) => {
            event.target.classList.toggle("strikethrough");
            removeItem(event.target);
        });

        return newItem;
    }

    class shoppingListItem {
        constructor(id, item) {
            this.id = id;
            this.item = item;
        }
    }
}