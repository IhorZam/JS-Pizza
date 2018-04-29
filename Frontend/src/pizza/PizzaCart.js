/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Pizza_list = require('../Pizza_List');

//var order = require('./order.js');


//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    var is_in = false;

    Cart.forEach(function (value) {
       if (value.pizza.id === pizza.id && value.size === size){
           value.quantity += 1;
           is_in = true;
       }
    });
    if (!is_in) {
            Cart.push({
                pizza: pizza,
                size: size,
                quantity: 1
            });
    }

    updateCart();
}

function removeFromCart(cart_item) {
    var aux_cart = [];
    Cart.forEach(function (value) {
        if (value.pizza.id !== cart_item.pizza.id) {
            aux_cart.push(value);
        }else if (value.size !== cart_item.size){
            aux_cart.push(value);
        }
    });
    Cart = aux_cart;
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    Cart = JSON.parse(localStorage.getItem("cart"));
    if (Cart === null){
        Cart = [];
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    var button = $(".right-part").find(".buy");
    var info = $(".right-part").find(".bought");
    var counter = 0;
    var allPrize = 0;
    $(info).find(".clear").click(function () {
        Cart = [];
        updateCart();
    });


    if (Cart.length === 0){
        button.find(".sum").remove();

        localStorage.clear();
        var html_code = Templates.PizzaCart_Empty();
        $cart.append($(html_code));
        $(button).find("a").addClass("disabled");
        button.prepend("<div class=\"sum\"><span>Сума замовлення:</span><span>" + allPrize + "</span></div>");
    }else {
        $(button).find("a").click(function(){
        });


        button.find(".sum").remove();
        $(button).find("a").removeClass("disabled");

        
        //Онволення однієї піци
        function showOnePizzaInCart(cart_item) {
            var html_code = Templates.PizzaCart_OneItem(cart_item);

            counter += 1;

            var price = parseInt(cart_item.pizza[cart_item.size].price);

            allPrize += price * cart_item.quantity;

            var $node = $(html_code);

            $node.find(".plus").click(function () {
                //Збільшуємо кількість замовлених піц
                cart_item.quantity += 1;

                //Оновлюємо відображення
                updateCart();
            });

            $node.find(".minus").click(function () {
                if (cart_item.quantity - 1 === 0) {
                    removeFromCart(cart_item);
                } else {
                    cart_item.quantity -= 1;
                }
                updateCart();
            });

            $cart.append($node);

            $node.find(".delete").click(function () {
               removeFromCart(cart_item);
               updateCart();
            });
        }

        Cart.forEach(showOnePizzaInCart);

        button.prepend("<div class=\"sum\"><span>Сума замовлення:</span><span>" + allPrize + "</span></div>");

        localStorage.clear();
        localStorage.setItem("cart", JSON.stringify(Cart));
    }
    $(info).find(".num_of_bought").remove();
    $(info).find(".info").append("<span class=\"num_of_bought\">" + counter + "</span>");

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;
