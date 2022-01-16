window.addEventListener('load', init);

const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {
    getUsers();
    document.getElementById('user-create-button').addEventListener('click', addUser);
    document.getElementById("user-cancel-button").addEventListener('click', cancelUpdate);
}

function getUsers() {
    fetch('http://localhost:8081/admin/users', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
            .then(users => {
                users.forEach(user => {
                    let newRow =
                        `<tr id="table-row-${user.id}">
                            <td>${user.role}</td>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td> <button type="button" class="update-button" onclick="updateUser(${user.id})">update</button> </td>
                            <td> <button type="button" class="delete-button" onclick="deleteUser(${user.id})">delete</button> </td>
                        </tr>`;

                    document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                });
            });
}

function addUser() {
    if(checkInput() === false)
        return;

    var selectRole = document.getElementById('role');
    var role = selectRole.options[selectRole.selectedIndex].text;

    var user = {
        role: role,
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    }

    fetch('http://localhost:8081/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
            .then(resUser => {
                if (resUser.message) {
                    alert(resUser.message);
                }
                else {
                    let newRow =
                        `<tr id="table-row-${resUser.id}">
                            <td>${resUser.role}</td>
                            <td>${resUser.first_name}</td>
                            <td>${resUser.last_name}</td>
                            <td>${resUser.username}</td>
                            <td>${resUser.email}</td>
                            <td> <button type="button" class="update-button" onclick="updateUser(${resUser.id})">update</button> </td>
                            <td> <button type="button" class="delete-button" onclick="deleteUser(${resUser.id})">delete</button> </td>
                        </tr>`;

                    document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                    clearInput();
                }
            });
}

function updateUser(userId) {
    insertInput(userId);
    document.getElementById('update').style.visibility = 'visible';
    document.getElementById('user-update-button').addEventListener('click', () => {
        var selectRole = document.getElementById('role-update');
        var role = selectRole.options[selectRole.selectedIndex].text;

        var user = {
            role: role,
            first_name: document.getElementById('first-name-update').value,
            last_name: document.getElementById('last-name-update').value,
            username: document.getElementById('username-update').value,
            email: document.getElementById('email-update').value,
            password: document.getElementById('password-update').value,
        }
        fetch(`http://localhost:8081/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
                .then(resElement => {
                    if (resElement.message) {
                        alert(resElement.message);
                    }
                    else {
                        location.reload();
                        document.getElementById('password-update').value = '';
                        document.getElementById('update').style.visibility = 'hidden';                    
                    }
                });

    });
}

function cancelUpdate() {
    document.getElementById('password-update').value = '';
    document.getElementById('update').style.visibility = 'hidden';
}

function deleteUser(userId) {
    fetch(`http://localhost:8081/admin/users/${userId}`, {
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
                let trDelete = document.getElementById(`table-row-${userId}`);
                trDelete.parentNode.removeChild(trDelete);
            }
        });
}

function insertInput(userId) {
    fetch(`http://localhost:8081/admin/users/${userId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
            .then(user => {
                if (user.message) {
                    alert(user.message);
                }
                else {
                    document.getElementById('role-update').value = user.role.toLowerCase();
                    document.getElementById('first-name-update').value = user.first_name;
                    document.getElementById('last-name-update').value = user.last_name;
                    document.getElementById('username-update').value = user.username;
                    document.getElementById('email-update').value = user.email;
                }
            });
}

function checkInput() {
    if (document.getElementById('first-name').value.length < 3 || document.getElementById('first-name').value > 10) {
        alert('First name must have min 3 and max 10 characters');
        return false;
    }

    if (document.getElementById('last-name').value.length < 3 || document.getElementById('last-name').value > 15) {
        alert('Last name must have min 3 and max 15 characters');
        return false;
    }

    if (document.getElementById('username').value.length < 4 || document.getElementById('username').value > 10) {
        alert('Username must have min 3 and max 10 characters');
        return false;
    }

    return true;
}

function clearInput() {
    document.getElementById('first-name').value = '';
    document.getElementById('last-name').value = '';
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}