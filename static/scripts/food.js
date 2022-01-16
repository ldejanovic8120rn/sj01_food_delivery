window.addEventListener('load', init);

const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {
    initRestaurantSelect('food-restaurant');
    initRestaurantSelect('food-restaurant-update');
    getFoods();
    document.getElementById('food-create-button').addEventListener('click', addFood);
    document.getElementById("food-cancel-button").addEventListener('click', cancelUpdate);
}

function getFoods() {
    fetch('http://localhost:8081/admin/foods', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
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
    if (checkInput() === false)
        return;

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
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(food)
    })
        .then(res => res.json())
            .then(resFood => {
                if (resFood.message) {
                    alert(resFood.message);
                }
                else {
                    let newRow =
                        `<tr id="table-row-${resFood.id}">
                            <td>${resFood.name}</td>
                            <td>${resFood.price}</td>
                            <td>${resFood.restaurant.name}</td>
                            <td>${resFood.description}</td>
                            <td>${resFood.category}</td>
                            <td>${resFood.portion}</td>
                            <td> <button type="button" class="update-button" onclick="updateFood(${resFood.id})">update</button> </td>
                            <td> <button type="button" class="delete-button" onclick="deleteFood(${resFood.id})">delete</button> </td>
                        </tr>`;

                    document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                    clearInput();
                }
            });
}

function updateFood(foodId) {
    insertInput(foodId);
    document.getElementById('update').style.visibility = 'visible';
    document.getElementById('food-update-button').addEventListener('click', () => {
        var selectRestaurant = document.getElementById('food-restaurant-update');
        var restaurantId = selectRestaurant.options[selectRestaurant.selectedIndex].value;

        var selectCategory = document.getElementById('food-category-update');
        var textCategoty = selectCategory.options[selectCategory.selectedIndex].text;

        var selectPortion = document.getElementById('food-portion-update');
        var textPortion = selectPortion.options[selectPortion.selectedIndex].text;

        var food = {
            restaurant_id: restaurantId,
            name: document.getElementById('food-name-update').value,
            price: document.getElementById('food-price-update').value,
            description: document.getElementById('food-description-update').value,
            category: textCategoty,
            portion: textPortion,
        }

        fetch(`http://localhost:8081/admin/foods/${foodId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(food)
        })
            .then(res => res.json())
                .then(resElement => {
                    if (resElement.message) {
                        alert(resElement.message);
                    }
                    else {
                        location.reload();
                        document.getElementById('update').style.visibility = 'hidden';
                    }
                });
    })
}

function cancelUpdate() {
    document.getElementById('update').style.visibility = 'hidden';
}

function deleteFood(foodId) {
    fetch(`http://localhost:8081/admin/foods/${foodId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
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

function initRestaurantSelect(elementId) {
    var restaurantSelect = document.getElementById(elementId);

    fetch('http://localhost:8081/admin/restaurants', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
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

function insertInput(foodId) {
    fetch(`http://localhost:8081/admin/foods/${foodId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
            .then(food => {
                if (food.message) {
                    alert(food.message);
                }
                else {
                    document.getElementById('food-name-update').value = food.name;
                    document.getElementById('food-price-update').value = food.price;
                    document.getElementById('food-restaurant-update').value = food.restaurant_id;
                    document.getElementById('food-description-update').value = food.description;
                    document.getElementById('food-category-update').value = food.category.replace(/\s+/g, '-').toLowerCase();
                    document.getElementById('food-portion-update').value = food.portion.toLowerCase();
                }
            });
}

function checkInput() {
    if (document.getElementById('food-name').value.length < 3 || document.getElementById('food-name').value > 10) {
        alert('Food name must have min 3 and max 10 characters');
        return false;
    }

    if (document.getElementById('food-description').value.length < 1) {
        alert('Description must have min 1 character');
        return false;
    }

    return true;
}

function clearInput() {
    document.getElementById('food-name').value = '';
    document.getElementById('food-price').value = '';
    document.getElementById('food-description').value = '';
}