window.addEventListener('load', init);

function init() {
    getRestaurants();
    document.getElementById('create-button').addEventListener('click', addRestaurant());
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
                                <td> <button type="button" class="update-button" onclick="updateUser(${resRestaurant.id})">update</button> </td>
                                <td> <button type="button" class="delete-button" onclick="deleteUser(${resRestaurant.id})">delete</button> </td>
                            </tr>`;

                    document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                    clearInput();
                }
            });
}

function updateRestaurant(restaurantId) {
    alert('Not implemented');
}

function deleteRestaurant(restaurantId) {

}

function clearInput() {
    document.getElementById('restaurant-name').value = '';
    document.getElementById('restaurant-kitchen').value = '';
    document.getElementById('restaurant-city').value = '';
    document.getElementById('restaurant-street').value = '';
    document.getElementById('restaurant-phone').value = '';
    document.getElementById('restaurant-delivery-price').value = '';
}