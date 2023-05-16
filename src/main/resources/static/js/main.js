$(async function () {
    await getTableBody();
})

const fetchUser = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    getUsers: async () => await fetch('/admin'),
    getUser: async (id) => await fetch(`/admin/${id}`),
    updateUser: async (id, user) => await fetch(`/admin/${id}`, {
        method: 'PUT',
        headers: fetchUser.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`/admin/${id}`, {
        method: 'DELETE',
        headers: fetchUser.head
    })
}

async function getTableBody() {
    let table = $('#users-table-show tbody');
    table.empty();

    await fetchUser.getUsers()
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                let rolesUser = "";
                for (let role of user.roles) {
                    rolesUser += role.value;

                    rolesUser += " ";
                }

                let usersTable = '$(' +
                    '<tr>' +
                    '<td>' + user.id + '</td>' +
                    '<td>' + user.firstName + '</td>' +
                    '<td>' + user.lastName + '</td>' +
                    '<td>' + user.age + '</td>' +
                    '<td>' + user.email + '</td>' +
                    '<td>' + rolesUser + '</td>' +
                    '<td><a href="admin/' + user.id + '" class="btn btn-primary eBtn">Edit</a></td>' +
                    '<td><a href="admin/' + user.id + '" class="btn btn-danger dBtn">Delete</a></td>' +
                    '</tr>' +
                    ')';
                table.append(usersTable);
            })
        })
    $('.table .eBtn').on('click',function(event){
        event.preventDefault();
        const href = $(this).attr('href');
        $.get(href,function(user) {
            modalUpdateUser(user.id);
        });

        $('.myModal #customModal').modal();

    });

    $('.table .dBtn').on('click',function(event){
        event.preventDefault();
        const href = $(this).attr('href');
        $.get(href,function(user) {
            modalDeleteUser(user.id);
        });

        $('.myFormDelete #delete').modal();
    });
}

async function modalUpdateUser(id) {
    let modal = $('#customModal');

    await fetchUser.getUser(id)
        .then(response => response.json())
        .then(user => {
            let modalBody =
                '<div class="form-group">' +
                '<label htmlFor="idEdit">ID</label>' +
                '<input type="text" class="form-control" value="' + user.id + '" id="idEdit" readOnly/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="firstNameEdit">First Name</label>' +
                '<input type="text" class="form-control" value="' + user.firstName + '" id="firstNameEdit" placeholder="First name"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="lastNameEdit">Last Name</label>' +
                '<input type="text" class="form-control" value="' + user.lastName + '" id="lastNameEdit" placeholder="Last Name"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="ageEdit">Age</label>' +
                '<input type="text" class="form-control" value="' + user.age + '" id="ageEdit" placeholder="Age"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="emailEdit">Email</label>' +
                '<input type="email" class="form-control" value="' + user.email + '" id="emailEdit" placeholder="Email"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="passwordEdit">Password</label>' +
                '<input type="password" class="form-control" id="passwordEdit" placeholder="Password"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="rolesIdEdit">Role</label>' +
                '<select class="custom-select" id="rolesIdEdit" name="rolesId" multiple>' +
                '<option value="1">USER</option>' +
                '<option value="2">ADMIN</option>' +
                '</select>' +
                '</div>';
            modal.find('.modal-body').append(modalBody);

            let modalFooter =
                '<button type="button" class="btn btn-secondary buttonClose" data-dismiss="modal">Close</button> ' +
                '<button type="button" class="btn btn-primary buttonUpdate">Save changes</button>';
            modal.find('.modal-footer').append(modalFooter);
        })

    // отслеживаем закрытие модального окна
    modal.on('hide.bs.modal', function () {
        $('.modal-body').html('');
        $('.modal-footer').html('');
    });

    $('.modal-content .buttonUpdate').on('click', function () {

        let id = modal.find('#idEdit').val();
        let idRole = modal.find('select[name=rolesId]').val();

        let data = {
            id: id,
            firstName: modal.find('#firstNameEdit').val(),
            lastName: modal.find('#lastNameEdit').val(),
            age: modal.find('#ageEdit').val(),
            email: modal.find('#emailEdit').val(),
            password: modal.find('#passwordEdit').val(),
            roles: idRole
        }

        fetchUser.updateUser(id, data);
        setTimeout(getTableBody, 500);
        modal.modal('hide');
    })
    getSelection();
}

async function modalDeleteUser(id) {
    let modal = $('#delete');

    await fetchUser.getUser(id)
        .then(response => response.json())
        .then(user => {
            let modalBody =
                '<div class="form-group">' +
                '<label htmlFor="idEdit">ID</label>' +
                '<input type="text" class="form-control" value="' + user.id + '" id="idEdit" readOnly/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="firstNameEdit">First Name</label>' +
                '<input type="text" class="form-control" value="' + user.firstName + '" id="firstNameEdit" readonly/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="lastNameEdit">Last Name</label>' +
                '<input type="text" class="form-control" value="' + user.lastName + '" id="lastNameEdit" readonly/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="ageEdit">Age</label>' +
                '<input type="text" class="form-control" value="' + user.age + '" id="ageEdit" readonly/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="emailEdit">Email</label>' +
                '<input type="email" class="form-control" value="' + user.email + '" id="emailEdit" readonly/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label htmlFor="rolesIdEdit">Role</label>' +
                '<select class="custom-select" id="rolesIdEdit" name="rolesId" multiple disabled="true">' +
                '<option value="1">USER</option>' +
                '<option value="2">ADMIN</option>' +
                '</select>' +
                '</div>';
            modal.find('.modal-body').append(modalBody);

            let modalFooter =
                '<button type="button" class="btn btn-secondary buttonClose" data-dismiss="modal">Close</button> ' +
                '<button type="button" class="btn btn-danger buttonDelete">Delete</button>';
            modal.find('.modal-footer').append(modalFooter);
        })

    // отслеживаем закрытие модального окна
    modal.on('hide.bs.modal', function () {
        $('.modal-body').html('');
        $('.modal-footer').html('');
    });

    $('.modal-content .buttonDelete').on('click', function () {

        fetchUser.deleteUser(id);
        setTimeout(getTableBody, 500);
        modal.modal('hide');
    })
    getSelection();
}