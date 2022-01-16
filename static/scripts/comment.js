window.addEventListener('load', init);

const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {
    initRestaurantSelect('comment-restaurant');
    initRestaurantSelect('comment-restaurant-update');
    getComments();
    document.getElementById('comment-create-button').addEventListener('click', addComment);
    document.getElementById("comment-cancel-button").addEventListener('click', cancelUpdate);
}

function getComments() {
    fetch('http://localhost:8081/admin/comments', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .then(comments => {
            comments.forEach(comment => {
                let posted = new Date(comment.posted).toLocaleDateString('en-US');
                let newRow =
                    `<tr id="table-row-${comment.id}">
                                    <td>${comment.restaurant.name}</td>
                                    <td>${comment.user.username}</td>
                                    <td>${comment.rate}</td>
                                    <td>${comment.content}</td>
                                    <td>${comment.likes}</td>
                                    <td>${posted}</td>
                                    <td> <button type="button" class="update-button" onclick="updateComment(${comment.id})">update</button> </td>
                                    <td> <button type="button" class="delete-button" onclick="deleteComment(${comment.id})">delete</button> </td>
                                </tr>`;

                document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
            });
        });
}

function addComment() {
    if (checkInput() === false)
        return;
        
    var selectRestaurant = document.getElementById('comment-restaurant');
    var restaurantId = selectRestaurant.options[selectRestaurant.selectedIndex].value;

    var comment = {
        restaurant_id: restaurantId,
        rate: document.getElementById('comment-rate').value,
        content: document.getElementById('comment-content').value,
    }

    fetch('http://localhost:8081/admin/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(comment)
    })
        .then(res => res.json())
        .then(resComment => {
            if (resComment.message) {
                alert(resComment.message);
            }
            else {
                let posted = new Date(resComment.posted).toLocaleDateString('en-US');
                let newRow =
                    `<tr id="table-row-${resComment.id}">
                            <td>${resComment.restaurant.name}</td>
                            <td>${resComment.user.username}</td>
                            <td>${resComment.rate}</td>
                            <td>${resComment.content}</td>
                            <td>${resComment.likes}</td>
                            <td>${posted}</td>
                            <td> <button type="button" class="update-button" onclick="updateComment(${resComment.id})">update</button> </td>
                            <td> <button type="button" class="delete-button" onclick="deleteComment(${resComment.id})">delete</button> </td>
                        </tr>`;

                document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                clearInput();
            }
        });
}

function updateComment(commentId) {
    insertInput(commentId);
    document.getElementById('update').style.visibility = 'visible';
    document.getElementById('comment-update-button').addEventListener('click', () => {
        var selectRestaurant = document.getElementById('comment-restaurant-update');
        var restaurantId = selectRestaurant.options[selectRestaurant.selectedIndex].value;

        var comment = {
            restaurant_id: restaurantId,
            rate: document.getElementById('comment-rate-update').value,
            content: document.getElementById('comment-content-update').value,
        }

        fetch(`http://localhost:8081/admin/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(comment)
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

function deleteComment(commentId) {
    fetch(`http://localhost:8081/admin/comments/${commentId}`, {
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
                let trDelete = document.getElementById(`table-row-${commentId}`);
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

function insertInput(commentId) {
    fetch(`http://localhost:8081/admin/comments/${commentId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
            .then(comment => {
                if (comment.message) {
                    alert(comment.message);
                }
                else {
                    document.getElementById('comment-restaurant-update').value = comment.restaurant_id;
                    document.getElementById('comment-rate-update').value = comment.rate;
                    document.getElementById('comment-content-update').value = comment.content;
                }
            });
}

function checkInput() {
    if (document.getElementById('comment-content').value.length < 1) {
        alert('Content must have min 1 character');
        return false;
    }

    return true;
}

function clearInput() {
    document.getElementById('comment-rate').value = '';
    document.getElementById('comment-content').value = '';
}