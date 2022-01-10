window.addEventListener('load', init);

function init() {
    document.getElementById('logut-button').addEventListener('click', e => {
        document.cookie = `token=;SameSite=Lax`;
        window.location.href = '/login';
    })

    document.getElementById('user-button').addEventListener('click', e => {
        window.location.href = '/users';
    })

    document.getElementById('restaurant-button').addEventListener('click', e => {
        window.location.href = '/restaurants';
    })

    document.getElementById('food-button').addEventListener('click', e => {
        window.location.href = '/foods';
    })

    document.getElementById('comment-button').addEventListener('click', e => {
        window.location.href = '/comments';
    })
}