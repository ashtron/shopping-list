window.onload = () => {
    const airtableApiKey = config.AIRTABLE_API_KEY;
    const airtableApiUrl = `https://api.airtable.com/v0/appW7LfolPCsDiVXX/shopping-list`;

    const shoppingList = document.getElementById("shopping-list");
    const itemInput = document.getElementById("item-input");
    const saveButton = document.getElementById("save-button");
    const reloadButton = document.getElementById("reload-button");

    saveButton.addEventListener("click", addItem);
    reloadButton.addEventListener("click", getItems);
    itemInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter")
            addItem();
    });

    const shoppingListItems = [];

    init();

    function init() {
        getItems();
        itemInput.focus();
    }
    
    function getItems() {
        const queryString = "sort%5B0%5D%5Bfield%5D=date&sort%5B0%5D%5Bdirection%5D=asc"

        axios.get(airtableApiUrl + `?api_key=${airtableApiKey}&${queryString}`)
            .then(response => {
                updateDomList(response.data.records);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function updateDomList(retrievedItems) {
        shoppingList.innerHTML = "";

        retrievedItems.forEach(item => {
            shoppingListItems.push(new shoppingListItem(item.id, item.fields.item));

            let newItemElement = createItemElement(item.fields.item);
            shoppingList.append(newItemElement);
        });
    }

    function createItemElement(item, id) {
        const newItem = document.createElement("li");
        newItem.classList.add("shopping-list-item");
        newItem.id = id;
        newItem.innerText = item;

        newItem.addEventListener("click", event => {
            event.target.classList.toggle("strikethrough");
            
            removeItem(event.target);
        });

        return newItem;
    }

    function addItem(event) {
        const newItemName = itemInput.value;

        const newDate = new Date()
        const hours = newDate.getHours()
        const minutes = `${newDate.getMinutes() < 10 ? "0" : ""}${newDate.getMinutes()}`
        const dateString = newDate.toDateString()

        axios.post(airtableApiUrl + `?api_key=${airtableApiKey}`, {
                "fields": {
                    "item": newItemName,
                    "date": newDate.toISOString()
                }
            }).then(response => {
                shoppingListItems.push(new shoppingListItem(response.data.id, response.data.fields.item));

                shoppingList.append(createItemElement(newItemName, response.data.id));

                itemInput.value = "";
                itemInput.focus();
            }).catch(error => {
                console.log(error);
            });
    }

    function removeItem(itemElement) {
        console.log("itemElement: ", itemElement);

        const item = shoppingListItems.find(item => {
            return item.id === itemElement.id;
        });

        console.log("item: ", item);

        axios.delete(airtableApiUrl + `/${item.id}` + `?api_key=${airtableApiKey}`)
            .catch(error => {
                console.log(error);
            });
    }

    class shoppingListItem {
        constructor(id, item) {
            this.id = id;
            this.item = item;
        }
    }
}