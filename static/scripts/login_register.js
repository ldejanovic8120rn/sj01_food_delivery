window.addEventListener('load', init);

function init() {
    document.getElementById('signup-button').addEventListener('click', signUp);
    document.getElementById("login-button").addEventListener('click', login);
}

function signUp() {
    var user = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    }

    fetch('http://localhost:8082/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(resUser => {
            if (resUser.message) {
                alert(resUser.message);
            }
            else {
                alert('Successfully registered');
                document.cookie = `token=${resUser.token};SameSite=Lax`;
                window.location.href = 'index.html';
            }
        });
}

function login() {
    var user = {
        email: document.getElementById('email-login').value,
        password: document.getElementById('password-login').value,
    }

    fetch('http://localhost:8082/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
            .then(resUser => {
                if (resUser.message) {
                    alert(resUser.message);
                }
                else {
                    document.cookie = `token=${resUser.token};SameSite=Lax`;
                    window.location.href = 'index.html';
                }
            });
}