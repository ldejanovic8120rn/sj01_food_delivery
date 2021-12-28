window.addEventListener('load', init);

function init() {
    initRestaurantSelect();
    getFoods();
    document.getElementById('food-create-button').addEventListener('click', addFood);
}

function getFoods() {
    fetch('http://localhost:8081/admin/foods', {})
        .then(res => res.json())
            .then(foods => {
                foods.forEach(food => {
                    let newRow =
                        `<tr id="table-row-${food.id}">
                                    <td>${food.name}</td>
                                    <td>${food.price}</td>
                                    <td>${food.restaurant.name}</td>
                                    <td>${food.description}</td>
                                    <td>${food.category}</td>
                                    <td>${food.portion}</td>
                                    <td> <button type="button" class="update-button" onclick="updateFood(${food.id})">update</button> </td>
                                    <td> <button type="button" class="delete-button" onclick="deleteFood(${food.id})">delete</button> </td>
                                </tr>`;

                    document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                });
            });

}

function addFood() {
    var selectRestaurant = document.getElementById('food-restaurant');
    var restaurantId = selectRestaurant.options[selectRestaurant.selectedIndex].value;

    var selectCategory = document.getElementById('food-category');
    var textCategoty = selectCategory.options[selectCategory.selectedIndex].text;

    var selectPortion = document.getElementById('food-portion');
    var textPortion = selectPortion.options[selectPortion.selectedIndex].text;

    var food = {
        restaurant_id: restaurantId,
        name: document.getElementById('food-name').value,
        price: document.getElementById('food-price').value,
        description: document.getElementById('food-description').value,
        category: textCategoty,
        portion: textPortion,
    }

    fetch('http://localhost:8081/admin/foods', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(food)
    })
        .then(res => res.json())
            .then(resFood => {
                if (resFood.message) {
                    alert(resFood.message);
                }
                else {
                    fetch(`http://localhost:8081/admin/restaurants/${resFood.restaurant_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(res1 => res1.json())
                            .then(resRestaurant => {
                                let newRow =
                                    `<tr id="table-row-${resFood.id}">
                                        <td>${resFood.name}</td>
                                        <td>${resFood.price}</td>
                                        <td>${resRestaurant.name}</td>
                                        <td>${resFood.description}</td>
                                        <td>${resFood.category}</td>
                                        <td>${resFood.portion}</td>
                                        <td> <button type="button" class="update-button" onclick="updateFood(${resFood.id})">update</button> </td>
                                        <td> <button type="button" class="delete-button" onclick="deleteFood(${resFood.id})">delete</button> </td>
                                    </tr>`;

                                document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                                clearInput();

                            })
                }
            });
}

function updateFood(foodId) {
    alert('Not implemented');
}

function deleteFood(foodId) {
    fetch(`http://localhost:8081/admin/foods/${foodId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            if (res.json().message) {
                alert(res.json().message);
            }
            else {
                let trDelete = document.getElementById(`table-row-${foodId}`);
                trDelete.parentNode.removeChild(trDelete);
            }
        });
}

function initRestaurantSelect() {
    var restaurantSelect = document.getElementById("food-restaurant");

    fetch('http://localhost:8081/admin/restaurants', {})
        .then(res => res.json())
        .then(restaurants => {
            restaurants.forEach(restaurant => {
                let option = document.createElement("option");
                option.text = restaurant.name;
                option.value = restaurant.id;
                restaurantSelect.add(option);
            });
        });
}

function clearInput() {
    document.getElementById('food-name').value = '';
    document.getElementById('food-price').value = '';
    document.getElementById('food-description').value = '';
}