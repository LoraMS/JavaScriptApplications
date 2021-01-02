import { ShoppingCartController } from 'shoppingCartController';
import { ShoppingCartManager } from 'shoppingCartManager';
import bootstrap from 'bootstrap';
import toastr from 'toastr';
import { templates } from 'templates';
import { userModel } from 'userModel';
import { appModel } from 'appModel';

let userController = (function() {
    class UserController {
        constructor(templates, userModel) {
            this.shoppingCartController = null;
            this.shoppingCartManager = new ShoppingCartManager("", window.storage);
            this.templates = templates;
            this.userModel = userModel;
        }
        
        getContactForm(selector) {
            $(selector).empty();
            $('aside').addClass('hidden');
            this.templates.getTemplate('contact-form').then((responseTemplate) => {
                selector.html(responseTemplate());
            }).catch((error) => {
                toastr.error('Unable to display form!');
                location.hash = '#/home';
            });
        }

        getRegisterForm(selector) {
            $(selector).empty();
            $('aside').addClass('hidden');
            this.templates.getTemplate('register-form').then((responseTemplate) => {
                selector.html(responseTemplate());
            });
        }

        registerAction(selector, email, password, confirmPassword) {
            $(selector).empty();

            if(password !== confirmPassword){
                toastr.error('Please confirm correctly password!');
                return;
            }

            userModel.register(email, password).then((userInfo) => {
                toastr.success('User registration successful!');
                userModel.changeAuthState();
                location.hash = '#/home';
            }).catch((error) => {
                toastr.error('Invalid username or password!');
            });
        }

        // getLogInForm(selector) {
        //     $(selector).empty();
            
        //     this.templates.getTemplate('login-form').then((responseTemplate) => {
        //         selector.html(responseTemplate());
        //     }).then(() => {
                // appModel.getMeal().then((data) => {
                //     const recent = data.slice(0, 7);
                //     resultPosts = {
                //         recentPosts: recent
                //     };
                //     return templates.getTemplate('recent-posts');
                // }).then((template) => {
                //     $('.list-posts').html(template(resultPosts));
                // });
            // }).then(() => {
                // appModel.getAllComments().then((data) => {
                //     const recent = data.slice(0, 7);
                //     resultComments = {
                //         recentComments: recent
                //     };
                //     return templates.getTemplate('recent-comments');
                // }).then((template) => {
                //     $('.list-comments').html(template(resultComments));
                // });
        //     }).catch((error) => {
        //         toastr.error('');
        //     });
        // }

        loginAction(selector, email, password) {
            $(selector).empty();
           
            userModel.login(email, password).then((userInfo) => {
            // this.shoppingCartManager.username = user;
            // this.shoppingCartManager.items = [];
            // this.shoppingCartController = new ShoppingCartController(templates, userController.shoppingCartManager);
            // let cartElement = this.shoppingCartManager.shoppingCartElement;
            // cartElement.show();
            // cartElement.on('click', () => {
            //     this.shoppingCartController.viewCart($('#menu'))
            // });
            // $('#loggedInUser').append(() => this.shoppingCartManager.shoppingCartElement);
            // $('#loggedInUser').append(() => this.shoppingCartManager.shoppingItemsCountElement.text(0));

                toastr.success('User login successful!');
                userModel.changeAuthState();
                location.hash = '#/paintings';
            }).catch((error) => {
                toastr.error('Invalid username or password!');
                location.hash = '#/home';
            });
        }

        logout() {
            userModel.logout().then(() => {
                localStorage.clear();
                // $("#shopping-cart").hide();
                toastr.success('Logout successful!');
                location.hash = '#/home';
            });
        }

    }
    return new UserController(templates);
})();

export { userController };