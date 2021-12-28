window.addEventListener('load', init);

function init() {
    initRestaurantSelect();
    getComments();
    document.getElementById('comment-create-button').addEventListener('click', addComment);
}

function getComments() {
    fetch('http://localhost:8081/admin/comments', {})
        .then(res => res.json())
        .then(comments => {
            comments.forEach(comment => {
                let newRow =
                    `<tr id="table-row-${comment.id}">
                                    <td>${comment.restaurant.name}</td>
                                    <td>${comment.user.name}</td>
                                    <td>${comment.rate}</td>
                                    <td>${comment.content}</td>
                                    <td>${comment.likes}</td>
                                    <td>${comment.posted}</td>
                                    <td> <button type="button" class="update-button" onclick="updateComment(${comment.id})">update</button> </td>
                                    <td> <button type="button" class="delete-button" onclick="deleteComment(${comment.id})">delete</button> </td>
                                </tr>`;

                document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
            });
        });
}

function addComment() {

}

function updateComment(commentId) {
    alert('Not implemented');
}

function deleteComment(commentId) {
    fetch(`http://localhost:8081/admin/comments/${commentId}`, {
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
                let trDelete = document.getElementById(`table-row-${commentId}`);
                trDelete.parentNode.removeChild(trDelete);
            }
        });
}

function initRestaurantSelect() {
    var restaurantSelect = document.getElementById("comment-restaurant");

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