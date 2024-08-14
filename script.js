let dishes = [
    {
        name: "Beilagensalat",
        ingredients: "mit Tomaten, grünem Salat, Gurken und Zwiebeln",
        price: "4.50",
        category: "Salat"
    },
    {
        name: "Rucola Salat",
        ingredients: "mit Rucola, Tomaten, Paprika, Gurken, Zwiebeln und Parmesan",
        price: "6.00",
        category: "Salat"
    },
    {
        name: "Thunfisch Salat",
        ingredients: "mit grünem Salat, Cinakohl, Tomaten, Oliven, Gurken und Zwiebeln",
        price: "7.50",
        category: "Salat"
    },
    {
        name: "Pizza Margherita",
        ingredients: "mit Tomaten und Käse",
        price: "8.00",
        category: "Pizza"
    },
    {
        name: "Pizza Salami",
        ingredients: "mit Tomaten, Käse und Salami",
        price: "9.00",
        category: "Pizza"
    },
    {
        name: "Pizza Napoli",
        ingredients: "mit Tomaten, Käse und Sardellen",
        price: "9.50",
        category: "Pizza"
    },
    {
        name: "Spaghetti Bolognese",
        ingredients: "mit würziger Hackfleischsoße",
        price: "8.50",
        category: "Pasta"
    },
    {
        name: "Penne Vegetariane",
        ingredients: "mit Broccoli, Auberginen, Zucchini, Paprika, Pilzen, Knoblauch und Tomatensoße",
        price: "9.00",
        category: "Pasta"
    },
    {
        name: "Rigatoni Al Forno",
        ingredients: "mit Vorderschinken, Hackfleischsoße, Sahne und Käse überbacken",
        price: "9.50",
        category: "Pasta"
    }
]

let basket_food = [];
let basket_prices = [];
let amount = [];

loadBasket();

function renderDishes() {
    let previousCategory;
    let dishSection = document.getElementById("dishes");
    dishSection.innerHTML = '';
    for (let i = 0; i < dishes.length; i++) {
        const dish = dishes[i];
        if (dish.category !== previousCategory) {
            foodCategories(dish, dishSection);
        previousCategory = dish.category;
        }
    renderSingleDish(i, dish);
    } 
}

function foodCategories(dish, dishSection) {   
    switch (dish.category) {
        case "Salat": dishSection.innerHTML += saladCategory();
        break;
        case "Pizza": dishSection.innerHTML += pizzaCategory();
        break;
        case "Pasta": dishSection.innerHTML += pastaCategory();
        break;
    }
}

function renderBasket() {
    let basket = document.getElementById('basket-container');
    basket.innerHTML = '';
    if (basket_food.length == 0) {
        basket.innerHTML = empyBasketTemplate();
    } else {
        filledShoppingCart(basket);
    }
}


function filledShoppingCart(basket) {
    let sum = 0;
    let deliveryCost = 2;
    basket.innerHTML += basketDivTemplate();
    let basketItemsList = document.getElementById('basket-items-list');
    for (let i = 0; i < basket_food.length; i++) {
        let item = basket_food[i];
        let price = basket_prices[i];
        let dishesSum = price * amount[i];
        basketItemsList.innerHTML += basketItemsListTemplate(item, amount, dishesSum, i);
        sum += dishesSum;
    }
    let sumTotal = sum + deliveryCost;
    basket.innerHTML += basketTableTemplate(deliveryCost, sum, sumTotal);
}

function addToBasket(i) {
    let dish = dishes[i];
    let index = basket_food.findIndex(item => item === dish.name);
    
    if (index === -1) {
        basket_food.push(dish.name);
        basket_prices.push(parseFloat(dish.price));
        amount.push(1);
    } else {
        amount[index]++;
    } 
    saveBasket();   
    renderBasket();
}

function removeFood(index) {
    if (amount[index] === 1) {
        basket_food.splice(index, 1);
        basket_prices.splice(index, 1);
        amount.splice(index, 1);
    } else {
        amount[index]--;
    }
    saveBasket(); 
    renderBasket();
    updateResponsiveBasket();
}

function addFood(index) {
    amount[index]++;
    saveBasket(); 
    renderBasket();
    updateResponsiveBasket();
}

function payButton() {
    amount.length = 0;
    basket_food.length = 0;
    basket_prices.length = 0;
    saveBasket(); 
    renderBasket();
    updateResponsiveBasket();
    document.getElementById("overlay").style.display = "block";
}

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
}

function saveBasket() {
    let amountAsText = JSON.stringify(amount);
    let foodAsText = JSON.stringify(basket_food);
    let pricesAsText = JSON.stringify(basket_prices);

    localStorage.setItem('Amount', amountAsText);
    localStorage.setItem('basket_food', foodAsText);
    localStorage.setItem('basket_prices', pricesAsText);
}

function loadBasket() {
    let amountAsText = localStorage.getItem('Amount');
    let foodAsText = localStorage.getItem('basket_food');
    let pricesAsText = localStorage.getItem('basket_prices');

    if (amountAsText && foodAsText && pricesAsText) {
        amount = JSON.parse(amountAsText);
        basket_food = JSON.parse(foodAsText);
        basket_prices = JSON.parse(pricesAsText);
    }
}

function showResponsiveBasketContainer() {
    let responsiveBasket = document.getElementById("responsive-basket-container");
    if (window.innerWidth <= 1080) {
        responsiveBasket.style.display = "flex";
    } else {
        responsiveBasket.style.display = "none";
        closeMobieBasket();
    }
}

function closeMobieBasket() {
    if(window.innerWidth > 1080) {
        document.getElementById('responsive-basket').classList.add('hidden');
    }
}

window.onload = showResponsiveBasketContainer;
window.onresize = showResponsiveBasketContainer;

function responsiveBasket() {
    document.getElementById("responsive-basket").classList.remove('hidden');
    let mobileBasket = document.getElementById('mobile-basket');
    mobileBasket.innerHTML = '';

    if (basket_food.length == 0) {
        mobileBasket.innerHTML = mobileBasketTemplate();
    }   else {
        filledMobileShoppingCart(mobileBasket);
    }
}

function mobileBasketTemplate() {
    return /*html*/`
        <div class="empty-basket" id="empty-basket">
            <img src="./img/shopping-bag.png" class="shopping-bag-img">
            <h2 style="padding-bottom: 5px;">Fülle deinen Warenkorb</h2>
            <span class="empty-basket-text">Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</span>
        </div>
        `;
}

function mobileBasketDivTemplate() {
    return /*html*/`
    <div class="basket-items">
        <div id="mobile-basket-items-list"></div>
    </div>
    `;
}

function closeResponsiveBasket() {
    document.getElementById("responsive-basket").classList.add('hidden');
}

function updateResponsiveBasket() {
    if(window.innerWidth < 1080) {
        responsiveBasket();
    }
}

function filledMobileShoppingCart(mobileBasket) {
    let sum = 0;
    let deliveryCost = 2;
    mobileBasket.innerHTML += mobileBasketDivTemplate();
    let basketItemsList = document.getElementById('mobile-basket-items-list');
    for (let i = 0; i < basket_food.length; i++) {
        let item = basket_food[i];
        let price = basket_prices[i];
        let dishesSum = price * amount[i];
        basketItemsList.innerHTML += basketItemsListTemplate(item, amount, dishesSum, i);
        sum += dishesSum;
    }
    let sumTotal = sum + deliveryCost;
    mobileBasket.innerHTML += basketTableTemplate(deliveryCost, sum, sumTotal)
}

function saladCategory() {
    return /*html*/`
    <img src="./img/salat.jpg" class="dish-section" id="salad">
    <h2 class="dish-section-header">Salate</h2>
    `;
}

function pizzaCategory() {
    return /*html*/`
    <img src="./img/pizza2.jpg" class="dish-section" id="pizza">
    <h2 class="dish-section-header">Pizza</h2>
    `;
}

function pastaCategory() {
    return /*html*/`
    <img src="./img/pasta.jpg" class="dish-section" id="pasta">
    <h2 class="dish-section-header">Pasta</h2>
    `;
}

function renderSingleDish(i, dish) {
    document.getElementById('dishes').innerHTML += /*html*/`
    <div class="dish">
        <div class="dish-header">
            <div class="name-of-dish">
                <h3>${dish["name"]}</h3>
                <img src="./img/information.png" class="dish-symbol-left">
            </div>
            <img src="./img/add.png" class="dish-symbol-right" onclick="addToBasket(${i})">
        </div>
        <span class="dish-description">${dish["ingredients"]}</span>
        <h3 class="price">${dish["price"].replace('.',',')} €</h3>
    </div>
    `;
}

function empyBasketTemplate() {
    return /*html*/`
    <div class="empty-basket" id="empty-basket">
        <img src="./img/shopping-bag.png" class="shopping-bag-img">
        <h2 style="padding-bottom: 5px;">Fülle deinen Warenkorb</h2>
        <span class="empty-basket-text">Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</span>
    </div>
    `;
}

function basketItemsListTemplate(item, amount, dishesSum, i) {
    return /*html*/`
    <div class="item-order">
        <div class="item-overview">
            <div class="item-amount">
                <span style="padding-right: 10px;">${amount[i]}</span>
                <span class="item-basket">${item}</span>
            </div>
            <div class="item-price">${dishesSum.toFixed(2).replace('.', ',')} €</div>
        </div>
        <div class="change-amount">
            <img src="./img/remove.png" class="amount-symbol change-amount-element" onclick="removeFood(${i})">
            <span class="change-amount-element">${amount[i]}</span>
            <img src="./img/add.png" class="amount-symbol change-amount-element" onclick="addFood(${i})">
        </div>
    </div>
    `;
}

function basketTableTemplate(deliveryCost, sum, sumTotal) {
    return /*html*/`
    <table class="table">
        <tr>
            <td class="sum-names">Zwischensumme</td>
            <td id="subtotal" class="calculation">${sum.toFixed(2).replace('.', ',')} €</td>
        </tr>
        <tr>
            <td class="sum-names">Lieferkosten</td>
            <td class="calculation">${deliveryCost.toFixed(2).replace('.', ',')} €</td>
        </tr>
        <tr>
            <td class="final-sum sum-names">Gesamt</td>
            <td id="final_sum" class="finale-sum calculation">${sumTotal.toFixed(2).replace('.', ',')} €</td>
        </tr>
    </table>
    <div class="order-btn-div">
        <button class="order-btn" onclick="payButton()">
            <h2 id="final_sum_button" class="order-btn-txt">Bezahlen (${sumTotal.toFixed(2).replace('.', ',')} €)</h2>
        </button>
    </div>
    `;
}

function basketDivTemplate() {
    return /*html*/`
    <div class="basket-items">
        <div id="basket-items-list"></div>
    </div>
    `;
}