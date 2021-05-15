import Sammy from 'sammy';
import toastr from 'toastr';
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;
import { userController } from 'userController';
import { appController } from 'appController';
import { shoppingCartController } from 'shoppingCartController';
import { shoppingCartManager } from 'shoppingCartManager';
import { appModel } from 'appModel';

let app = app || {};

(function () {
    app.router = Sammy(function () {
        let selector = $('main');

        this.get('#/', function () {
            this.redirect('#/home');
        });

        this.get('#/home', function () {
            appController.getHomePage(selector);
        });

        this.get('#/register', function () {
            userController.getRegisterForm(selector);
        });

        this.post('#/register', function () {
            const email = this.params.email;
            const password = this.params.password;
            const confirmPassword = this.params.confirmPassword;
            userController.registerAction(selector, email, password, confirmPassword);
        });

        this.post('#/login', function () {
            const email = this.params.email;
            const password = this.params.password;
            userController.loginAction(selector, email, password);
        });

        this.get('#/logout', function () {
            userController.logout();
        });

        this.get('#/paintings', function () {
            appController.getGallery(selector);
        });

        this.get('#/paintings/:id', function () {
            const id = this.params["id"];
            appController.getPaintingById(selector, id);
        });

        this.get('#/artist-info/:artist', function () {
            const artist = this.params["artist"];
            appController.getPaintingByArtist(selector, artist);
        });

        this.get('#/style/:style', function () {
            const style = this.params["style"];
            appController.getPaintingsByStyle(selector, style);
        });

        this.get('#/subject/:subject', function () {
            const subject = this.params["subject"];
            appController.getPaintingsBySubject(selector, subject);
        });

        this.get('#/technique/:technique', function () {
            const technique = this.params["technique"];
            appController.getPaintingsByTechnique(selector, technique);
        });

        this.get('#/contact', function () {
            userController.getContactForm(selector);
        });

        this.get('#/send', function () {
           userController.sendContactInformation();
        });

        $(document).on('click', '#search-btn', function () {
            let data = $('#search-input').val();
            let option = $('#select').val();

            $('#search-input').val('');

            if (option === 'title') {
                appController.searchByTitle(selector, data);
            } else if (option === 'artist') {
                appController.searchByArtist(selector, data);
            }
        });
    });

    app.router.run('#/');
})();