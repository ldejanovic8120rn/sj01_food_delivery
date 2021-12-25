window.addEventListener('load', init);

function init() {
    getUsers();
    document.getElementById('user-create-button').addEventListener('click', addUser);
}

function getUsers() {
    fetch('http://localhost:8081/admin/users', {})
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
                            <td> <button type="button" class="update-button" onclick="updateUser(${user})">update</button> </td>
                            <td> <button type="button" class="delete-button" onclick="deleteUser(${user.id})">delete</button> </td>
                        </tr>`;

                    document.querySelector('#table-body').innerHTML = document.querySelector('#table-body').innerHTML + newRow;
                });
            });
}

function addUser() {
    var user = {
        role: "MODERATOR",
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
    alert('Not implemented');
}

function deleteUser(userId) {
    fetch(`http://localhost:8081/admin/users/${userId}`, {
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
                let trDelete = document.getElementById(`table-row-${userId}`);
                trDelete.parentNode.removeChild(trDelete);
            }
        });
}

function clearInput() {
    document.getElementById('first-name').value = '';
    document.getElementById('last-name').value = '';
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}