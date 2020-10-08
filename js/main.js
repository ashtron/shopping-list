window.onload = () => {
    const airtableApiKey = config.AIRTABLE_API_KEY;
    const shoppingList = document.getElementById("shopping-list");

    getItems();
    
    function getItems() {
        axios.get(`https://api.airtable.com/v0/appW7LfolPCsDiVXX/Table%201?api_key=${airtableApiKey}`)
        .then(response => {
            response.data.records.forEach(item => {
                let newShoppingListItem = document.createElement("li");
                newShoppingListItem.innerText = item.fields.item;
                newShoppingListItem.classList.add("shopping-list-item");
                newShoppingListItem.addEventListener("click", (event) => {
                    event.target.classList.toggle("strikethrough");
                });
                shoppingList.append(newShoppingListItem);
            });
        });
    }

    function removeItem() {}
}