window.addEventListener('load', init);

function init() {
    document.getElementById('user-button').addEventListener('click', e => {
        window.location.href = 'users.html';
    })

    document.getElementById('restaurant-button').addEventListener('click', e => {
        window.location.href = 'restaurants.html';
    })

    document.getElementById('food-button').addEventListener('click', e => {
        window.location.href = 'foods.html';
    })

    document.getElementById('comment-button').addEventListener('click', e => {
        window.location.href = 'comments.html';
    })
}