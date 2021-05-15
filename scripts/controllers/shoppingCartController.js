import toastr from 'toastr';
import { appModel } from 'appModel';
import { templates } from "templates";
import { userController } from 'userController';
import { shoppingCartManager } from 'shoppingCartManager';

let shoppingCartController = (function() {
class ShoppingCartController {
    constructor(templates) { 
        this.templates = templates;
    }

    viewCart(selector) {
        let cartContainer = $('#shopping-cart');
        cartContainer.appendTo(selector);
        let result = {
            paintings: shoppingCartManager.items
        }
        this.templates.getTemplate('shopping-cart')
            .then(template => $(cartContainer).html(template(result)))
            .then(() => $('#total-price').html(shoppingCartManager.totalPrice))
            .then(() => $('.cart-close').on('click', () => $(".cart-content").css('display', 'none')))
            .then(() => $('.remove-item').on('click', (e) => {
                this.removeItem(e.target.id);
            }))
            .then(() => $('.order-button').on('click', () => this.viewOrder(result, cartContainer)));
    }

    viewOrder(result, cartContainer) {
        this.templates.getTemplate('order-form')
            .then(template => $(cartContainer).html(template(result)))
            .then(() => $('.close').on('click', () => $(".order-container").css('display', 'none')));
    }

    removeItem(id) {
        let newItmensCount = shoppingCartManager.shoppingItemsCountElement.text();
        newItmensCount--;
        shoppingCartManager.shoppingItemsCountElement.text(newItmensCount);
        let filteredItems = shoppingCartManager.items.filter((item) => item.id !== id);
        shoppingCartManager.items = filteredItems;
        let parent = $('#' + id).parent();
        $('#' + id).remove();
        $(parent).remove();
        $('#total-price').html(shoppingCartManager.totalPrice);

    }
}
return new ShoppingCartController(templates);
})();

export { shoppingCartController };