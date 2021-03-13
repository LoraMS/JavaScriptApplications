class ShoppingCartManager {
    constructor(storage) {
        // this.shoppingCartElement = $('<img />', {
        //     id: 'shoppingCart',
        //     src: '../../images/shopping-cart-16.png',
        //     alt: 'Shopping cart'
        // });
        this.shoppingItemsCountElement = $('<span>', { id: "fluid-notification" });
        this.items = [];
        this.storage = storage;
    }
    get totalPrice() {
        let sum = 0;
        for (var i = 0; i < this.items.length; i++) {
            sum += +this.items[i].price.replace(/[^0-9]/g, '');
        }
        return sum + " " + this.currency;
    }

    get currency() {
        if (this.items.length > 0) {
            return this.items[0].price.replace(/[0-9]/g, '');
        } else {
            return "USD";
        }
    }
    storeCart() {
        this._storage.setItem(this._user.name, this._shoppingCart.toString())
    }

    isAdded(id) {
        return this.items.find(item => item.id === id)
    }
}

export { ShoppingCartManager }