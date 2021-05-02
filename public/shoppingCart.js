const taxRate = 0.13;

//List of Items
// const itemsList = [
//     {
//         name: "Bear",
//         img: ["item-bear1.png", "item-bear2.png", "item-bear3.png"],
//         type: "Animal",
//         desc: "This soft, adorable bear will warm your heart.",
//         price: 19.99
//     }, {
//         name: "Blue Flower",
//         img: ["item-blueflower1.png", "item-blueflower2.png"],
//         type: "Flower",
//         desc: "A flower that will take the blue for you.",
//         price: 4.99
//     }, {
//         name: "Violet Flower",
//         img: ["item-pinkflower1.png", "item-pinkflower2.png"],
//         type: "Flower",
//         desc: "Roses are red, and some violets are violet.",
//         price: 3.99
//     }, {
//         name: "Ring",
//         img: ["item-ring1.png", "item-ring2.png"],
//         type: "Jewelry",
//         desc: "Sometimes it is worth it to pull the trigger.",
//         price: 500
//     }, {
//         name: "Smiley Figure",
//         img: ["item-smiley1.png", "item-smiley2.png"],
//         type: "Decoration",
//         desc: "A friendly gift to give a smile.",
//         price: 9.99
//     }, {
//         name: "Strawberry",
//         img: ["item-strawberry1.png", "item-strawberry2.png", "item-strawberry3.png"],
//         type: "Decoration",
//         desc: "A beaded gift that may have other uses.",
//         price: 0.99
//     }
// ];

//JSON items list
const masterItemsList = [];
const itemsList = [];
const filtersDict = {};
let requestURL = "items.json";
let request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = 'json';
request.send();

request.onload = function () {
    const loadJsonItems = request.response;
    for (let i = 0; i < loadJsonItems.length; i++) {
        masterItemsList.push(loadJsonItems[i]);
    }
    itemsList.push.apply(itemsList, masterItemsList);
    init();
};

function init() {
    loadShopItems();
    // loadShopButtons();
    loadFilter();
    updateTotalDisplay(0);
    loadBuyButton();
    loadClearButton();
    loadFilterButton();
    loadClearFilterButton();
}

function loadFilter() {
    //Set filter dictionary to not repeat
    for (let i = 0; i < itemsList.length; i++) {
        if (itemsList[i].type in filtersDict) { //when not in dictionary
            filtersDict[itemsList[i].type] += 1;
        } else {
            filtersDict[itemsList[i].type] = 1;
        }
    }

    //Load types
    let filterType = document.getElementById("filter-type");
    for (let key in filtersDict) {
        let displayQuantity = "";

        //Only display quantity if > 1
        if (filtersDict[key] > 1) {
            displayQuantity = "(" + filtersDict[key] + ")";
        }

        filterType.innerHTML += '<label><input type="checkbox" name="' + key + '" class="filter-checkbox">' +
            key + ' ' + displayQuantity + '</label>';
    }
}

function loadFilterButton() {
    let filterButton = document.getElementById("filter-button");
    filterButton.addEventListener("click", function () {
        //Clear items
        document.getElementById("item-section").innerHTML = "";
        //Update filter list
        filterItemsList();
    })
}

function filterItemsList() {
    filterByType();
    filterByPrice();
    loadShopItems();
}

function filterByType() {
    let checkboxes = document.getElementsByClassName("filter-checkbox");
    itemsList.length = 0; //clears array
    let checkedList = [];
    //Get list
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkedList.push(checkboxes[i].name);
        }
    }
    for (let i = 0; i < masterItemsList.length; i++) {
        if (checkedList.includes(masterItemsList[i].type)) {
            itemsList.push(masterItemsList[i])
        }
    }
    //Load all if empty
    if (itemsList.length === 0) {
        itemsList.push.apply(itemsList, masterItemsList);
    }
}
function filterByPrice() {
    let minPrice = document.getElementsByName("filter-min-price")[0].value;
    let maxPrice = document.getElementsByName("filter-max-price")[0].value;
    if (minPrice === "" || isNaN(minPrice) === true) {
        minPrice = 0;
    } else {
        minPrice = Number(minPrice);
    };
    if (maxPrice === "" || isNaN(maxPrice) === true) {
        maxPrice = 9999;
    } else {
        maxPrice = Number(maxPrice);
    };
    //iterate through itemsList in reverse order to go through all items
    for (let i = itemsList.length - 1; i >= 0; i--) {
        if (itemsList[i].price < minPrice || itemsList[i].price > maxPrice) {
            itemsList.splice(i, 1);
        }
    }
}

function loadClearFilterButton() {
    let filterButton = document.getElementById("clear-filter-button");
    filterButton.addEventListener("click", function () {
        let checkboxes = document.getElementsByClassName("filter-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        let minPrice = document.getElementsByName("filter-min-price")[0];
        let maxPrice = document.getElementsByName("filter-max-price")[0];
        minPrice.value = "";
        maxPrice.value = "";
    })
}

//Load itemsList to shop
function loadShopItems() {
    for (let i = 0; i < itemsList.length; i++) {
        loadShopItemsDisplay(i);
    };
    loadShopButtons();
}

//Loads display of items
function loadShopItemsDisplay(i) {
    let itemsDisplay = document.getElementById("item-section");
    itemsDisplay.innerHTML += '<div class="item" id="item-number' +
        i + '"><div><img class="item-img" src = "img/' +
        itemsList[i].img[0] + '" alt = ""></div><div><span class="item-name">' +
        itemsList[i].name + '</span><span class="img-scroll"><button class="item-next">' +
        '>' + '</button><button class="item-prev">' +
        '<' + '</button></span></div><span class="item-type">' +
        itemsList[i].type + '</span><span class="item-desc">' +
        itemsList[i].desc + '</span><span class="item-price">$' +
        roundAmountDisplay(itemsList[i].price) +
        '<button class="item-button">ADD</button>' +
        '<input type="number" min="1" max="99" step="1" value="1" class="item-quantity quantity-input-box"></span></div>';
}

function loadShopButtons() {
    let addItemButtons = document.getElementsByClassName("item-button");
    for (let i = 0; i < addItemButtons.length; i++) {
        let button = addItemButtons[i];
        button.addEventListener("click", addButtonClicked);
    }

    let nextItemButtons = document.getElementsByClassName("item-next");
    for (let i = 0; i < nextItemButtons.length; i++) {
        let button = nextItemButtons[i];
        button.addEventListener("click", nextImg);
    }

    let prevItemButtons = document.getElementsByClassName("item-prev");
    for (let i = 0; i < prevItemButtons.length; i++) {
        let button = prevItemButtons[i];
        button.addEventListener("click", prevImg);
    }
}

function nextImg(event) {
    let button = event.target;
    let parent = button.parentElement.parentElement.parentElement;
    let itemNumber = parent.id.slice(-1);  //Used for itemsList
    let imgSelect = parent.getElementsByClassName("item-img")[0];
    let imgSrc = imgSelect.src;
    let imgNumber = imgSrc.slice(-5, -4);
    let newNumber = Number(imgNumber);
    let newImgSrc = itemsList[itemNumber].img[newNumber];
    if (newImgSrc === undefined) {
        imgSelect.parentElement.innerHTML = '<img class="item-img" src = "img/' +
            itemsList[itemNumber].img[0] + '" alt = "">'
    } else {
        imgSelect.parentElement.innerHTML = '<img class="item-img" src = "img/' +
            newImgSrc + '" alt = "">'
    }
}
function prevImg(event) {
    let button = event.target;
    let parent = button.parentElement.parentElement.parentElement;
    let itemNumber = parent.id.slice(-1);  //Used for itemsList
    let imgSelect = parent.getElementsByClassName("item-img")[0];
    let imgSrc = imgSelect.src;
    let imgNumber = imgSrc.slice(-5, -4);
    let newNumber = Number(imgNumber) - 2;
    let newImgSrc = itemsList[itemNumber].img[newNumber];
    if (newImgSrc === undefined) {
        imgSelect.parentElement.innerHTML = '<img class="item-img" src = "img/' +
            itemsList[itemNumber].img[itemsList[itemNumber].img.length - 1] + '" alt = "">'
    } else {
        imgSelect.parentElement.innerHTML = '<img class="item-img" src = "img/' +
            newImgSrc + '" alt = "">'
    }
}

function addButtonClicked(event) {
    let button = event.target;
    let shopItem = button.parentElement.parentElement;
    let name = shopItem.getElementsByClassName("item-name")[0].innerText;
    let price = removeSign(shopItem.getElementsByClassName("item-price")[0].innerText);
    let quantity = shopItem.getElementsByClassName("item-quantity")[0].value;
    addItemToCart(name, price, Number(quantity));
}

function addItemToCart(name, price, quantity) {
    let existingCartItems = document.getElementsByClassName("cart-row");
    //Check if exist
    for (let i = 0; i < existingCartItems.length; i++) {
        let cartItemName = existingCartItems[i].getElementsByClassName("cart-item")[0];
        if (cartItemName.innerText === name) {
            let selectCartItemQuantity = cartItemName.parentElement.getElementsByTagName("input")[0];
            let newQuantity = Number(selectCartItemQuantity.value) + quantity;
            selectCartItemQuantity.value = newQuantity;
            updateCartTotals();
            return;
        }
    }

    //Add New otherwise
    let cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    let cartItems = document.getElementById('cart-items');
    let itemTotal = roundAmountDisplay(price * quantity)
    let addthisRow = '<span class="cart-column cart-item">' +
        name + '</span><span class="cart-column cart-price">' +
        roundAmountDisplay(price) + '</span><span class="cart-column cart-quantity">' +
        '<input type="number" min="1" max="99" step="1" value="' + quantity + '" class=".quantity-input-box"></input>' +
        '</span><span class="cart-column cart-total-price">' +
        itemTotal + '</span><span class="cart-column"><button class="remove-button">&times</button></span>';
    cartRow.innerHTML = addthisRow;
    cartItems.append(cartRow);
    cartRow.getElementsByTagName('input')[0].addEventListener('change', quantityChanged);
    cartRow.getElementsByClassName('remove-button')[0].addEventListener('click', removeCartItem);
    updateCartTotals();
}

//Quantity of cart items
function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotals();
}


//Returns quantity of input box next to Add to cart button
function getQuantityToAdd(i) {
    return Number(document.getElementsByTagName("input")[i].value);
}

//Remove Buttons
function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotals();
}

//Update Cart Totals
function updateCartTotals() {
    let cartRowList = document.getElementsByClassName("cart-row");
    //Update individual item totals
    for (let i = 0; i < cartRowList.length; i++) {
        let price = cartRowList[i].getElementsByClassName("cart-price")[0].innerText;
        let quantity = cartRowList[i].getElementsByTagName("input")[0].value;
        let itemTotal = roundAmountDisplay(Number(price) * Number(quantity));
        cartRowList[i].getElementsByClassName("cart-total-price")[0].innerText = itemTotal;
    }

    //Update subtotal
    let subTotal = 0;
    for (let i = 0; i < cartRowList.length; i++) {
        let cartRow = cartRowList[i];
        let itemTotalPrice = cartRow.getElementsByClassName("cart-total-price")[0].innerText;
        subTotal += Number(itemTotalPrice);
    }
    updateTotalDisplay(subTotal);
}

//Simple alert message for BUY
function loadBuyButton() {
    let button = document.getElementsByClassName("purchase-button")[0];
    button.addEventListener("click", function () {
        let subTotalDisplay = document.getElementById("cart-subtotal").innerText;
        if (Number(subTotalDisplay) === 0) {
            alert("The cart is empty, please add items");
        } else {
            alert("Thank you for the purchase!");
        }
    })
}

function loadClearButton() {
    let button = document.getElementsByClassName("clear-button")[0];
    button.addEventListener("click", function () {
        // let cartRows = document.getElementsByClassName("remove-button");
        // for (i = 0; i <= cartRows.length; i++) {
        //     console.log(2, cartRows)
        //     cartRows[i].click()
        // }
        let numberOfItems = document.getElementsByClassName("cart-row").length;

        for (let i = 0; i < numberOfItems; i++) {
            let cartRow = document.getElementsByClassName("cart-row")[0];
            cartRow.remove();
        }
        updateCartTotals();
    })
}

//Update display for subtotal, taxes, and total
function updateTotalDisplay(amount) {
    let subTotalDisplay = document.getElementById("cart-subtotal");
    let taxLabel = document.getElementById("tax-label");
    let taxDisplay = document.getElementById("cart-taxes");
    let totalDisplay = document.getElementById("cart-total");
    let taxes = amount * taxRate;
    let total = amount + taxes;
    let taxRateDisplay = taxRate * 100
    taxLabel.innerText = "TAXES (" + taxRateDisplay + "%)";
    subTotalDisplay.innerText = roundAmountDisplay(amount);
    taxDisplay.innerText = roundAmountDisplay(taxes);
    totalDisplay.innerText = "$" + roundAmountDisplay(total);
}

//Quick function to round amounts
function roundAmountDisplay(number) {
    return Number(number).toFixed(2);
}

//Removes dollar sign if in string
function removeSign(amount) {
    return parseFloat(amount.replace('$', ''))
}

