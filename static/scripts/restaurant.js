window.addEventListener('load', init);

function init() {
    getRestaurants();
    document.getElementById('restaurant-create-button').addEventListener('click', addRestaurant);
    document.getElementById("restaurant-cancel-button").addEventListener('click', cancelUpdate);
}

function getRestaurants() {
    fetch('http://localhost:8081/admin/restaurants', {})
        .then(res => res.json())
            .then(restaurants => {
                restaurants.forEach(restaurant => {
                    let newRow =
                        `<tr id="table-row-${restaurant.id}">
                                <td>${restaurant.name}</td>
                                <td>${restaurant.kitchen}</td>
                                <td>${restaurant.city}</td>
                                <td>${restaurant.street}</td>
                                <td>${restaurant.phone}</td>
                                <td>${restaurant.delivery_price}</td>
                                <td> <button type="button" class="update-button" onclick="updateRestaurant(${restaurant.id})">update</button> </td>
                                <td> <button type="button" class="delete-button" onclick="deleteRestaurant(${restaurant.id})">delete</button> </td>
                            </tr>`;

                    document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                });
            });
}

function addRestaurant() {
    var restaurant = {
        name: document.getElementById('restaurant-name').value,
        kitchen: document.getElementById('restaurant-kitchen').value,
        city: document.getElementById('restaurant-city').value,
        street: document.getElementById('restaurant-street').value,
        phone: document.getElementById('restaurant-phone').value,
        delivery_price: document.getElementById('restaurant-delivery-price').value,
    }
    
    fetch('http://localhost:8081/admin/restaurants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurant)
    })
        .then(res => res.json())
            .then(resRestaurant => {
                if (resRestaurant.message) {
                    alert(resRestaurant.message);
                }
                else {
                    let newRow =
                        `<tr id="table-row-${resRestaurant.id}">
                                <td>${resRestaurant.name}</td>
                                <td>${resRestaurant.kitchen}</td>
                                <td>${resRestaurant.city}</td>
                                <td>${resRestaurant.street}</td>
                                <td>${resRestaurant.phone}</td>
                                <td>${resRestaurant.delivery_price}</td>
                                <td> <button type="button" class="update-button" onclick="updateRestaurant(${resRestaurant.id})">update</button> </td>
                                <td> <button type="button" class="delete-button" onclick="deleteRestaurant(${resRestaurant.id})">delete</button> </td>
                            </tr>`;

                    document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                    clearInput();
                }
            });
}

function updateRestaurant(restaurantId) {
    insertInput(restaurantId);
    document.getElementById('update').style.visibility = 'visible';
    document.getElementById('restaurant-update-button').addEventListener('click', () => {
        var restaurant = {
            name: document.getElementById('restaurant-name-update').value,
            kitchen: document.getElementById('restaurant-kitchen-update').value,
            city: document.getElementById('restaurant-city-update').value,
            street: document.getElementById('restaurant-street-update').value,
            phone: document.getElementById('restaurant-phone-update').value,
            delivery_price: document.getElementById('restaurant-delivery-price-update').value,
        }

        fetch(`http://localhost:8081/admin/restaurants/${restaurantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(restaurant)
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

function deleteRestaurant(restaurantId) {
    fetch(`http://localhost:8081/admin/restaurants/${restaurantId}`, {
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
                let trDelete = document.getElementById(`table-row-${restaurantId}`);
                trDelete.parentNode.removeChild(trDelete);
            }
        });
}

function insertInput(restaurantId) {
    fetch(`http://localhost:8081/admin/restaurants/${restaurantId}`, {})
        .then(res => res.json())
            .then(restaurant => {
                if (restaurant.message) {
                    alert(restaurant.message);
                }
                else {
                    document.getElementById('restaurant-name-update').value = restaurant.name;
                    document.getElementById('restaurant-kitchen-update').value = restaurant.kitchen;
                    document.getElementById('restaurant-city-update').value = restaurant.city;
                    document.getElementById('restaurant-street-update').value = restaurant.street;
                    document.getElementById('restaurant-phone-update').value = restaurant.phone;
                    document.getElementById('restaurant-delivery-price-update').value = restaurant.delivery_price;
                }
            });
}

function clearInput() {
    document.getElementById('restaurant-name').value = '';
    document.getElementById('restaurant-kitchen').value = '';
    document.getElementById('restaurant-city').value = '';
    document.getElementById('restaurant-street').value = '';
    document.getElementById('restaurant-phone').value = '';
    document.getElementById('restaurant-delivery-price').value = '';
}