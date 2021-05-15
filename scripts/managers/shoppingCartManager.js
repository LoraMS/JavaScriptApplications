// class ShoppingCartManager {
let shoppingCartManager = (function() {
class ShoppingCartManager {
    constructor(storage) {
        this.shoppingItemsCountElement = $('<span>', { id: "fluid-notification" });
        this.items = [];
        this.storage = storage;
    }

    get totalPrice() {
        let sum = 0;
        for (var i = 0; i < this.items.length; i++) {
            sum += +this.items[i].price;
        }
        return sum;
    }

    isAdded(id) {
        return this.items.find(item => item.id === id)
    }

}

// export { ShoppingCartManager }

return new ShoppingCartManager("", window.storage);
})();

export { shoppingCartManager };