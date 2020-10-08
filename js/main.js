window.onload = () => {
    const airtableApiKey = config.AIRTABLE_API_KEY;
    const shoppingList = document.getElementById("shopping-list");
    const itemInput = document.getElementById("item-input");
    const saveButton = document.getElementById("save-button");

    saveButton.addEventListener("click", addItem);

    getItems();
    
    function getItems() {
        axios.get(`https://api.airtable.com/v0/appW7LfolPCsDiVXX/Table%201?api_key=${airtableApiKey}`)
            .then(response => {
                response.data.records.forEach(item => {
                    let newShoppingListItem = createShoppingListItem(item.fields.item);

                    shoppingList.append(newShoppingListItem);
                });
            });
    }

    function removeItem(event) {
        console.log(event.target.parentNode.innerText);
    }

    function addItem(event) {
        const newItem = itemInput.value;

        axios.post(`https://api.airtable.com/v0/appW7LfolPCsDiVXX/Table%201?api_key=${airtableApiKey}`, {
                "fields": {
                    "item": newItem
                }
            })
            .then(response => {
                shoppingList.innerHTML = "";
                getItems();
            });
    }

    function createShoppingListItem(item) {
        const newItem = document.createElement("li");

        newItem.classList.add("shopping-list-item");
        newItem.innerText = item;

        newItem.addEventListener("click", (event) => {
            event.target.classList.toggle("strikethrough");
        });

        return newItem;
    }
}