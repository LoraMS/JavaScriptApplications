import toastr from 'toastr';

class UserModel {

    changeAuthState(userInfo) {
        return firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                const email = user.email;
                const uid = user.uid;
                localStorage.setItem('email', email);
                localStorage.setItem('id', uid);
                $('#login-form').addClass('hidden');
                $('#loggedInUser').text('Welcome ' + email + '!');
                $('.isLoggedIn').removeClass('hidden');
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('id');
                $('.isLoggedIn').addClass('hidden');
                $('#login-form').removeClass('hidden');
            }
        });
    }

    login(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    register(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    logout() {
        return firebase.auth().signOut();
    }
}

const userModel = new UserModel();

export { userModel };


