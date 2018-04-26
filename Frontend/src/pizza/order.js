
var Templates = require('../Templates');

function buildPage(cart){
    var $order_det = $('#cart');

    cart.forEach(showOnePizzaInCart);

    var allPrize = 0;

    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var price = parseInt(cart_item.pizza[cart_item.size].price);



        allPrize += price * cart_item.quantity;

        var $node = $(html_code);

        $node.find(".plus").remove();

        $node.find(".minus").remove();

        $order_det.append($node);

        $node.find(".delete").remove();
    }

    $order_det.prepend("<div class=\"sum\"><span>Сума замовлення:</span><span>" + allPrize + "</span></div>");

}

exports.buildPage = buildPage;