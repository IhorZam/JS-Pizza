
var Templates = require('../Templates');

var api = require('../API');

function buildPage(cart){
    var $order_det = $('#cart');

    var $footer = $(".right-part").find(".buy");

    $('.rf').each(function(){
        var form = $(this),
            btn = form.find('.btn-login');

        form.find('.rfield').addClass('empty_field');

        function checkInput(){
            form.find('.rfield').each(function(){
                if($(this).val() !== ''){
                    $(this).removeClass('empty_field');
                } else {
                    $(this).addClass('empty_field');
                }
            });
        }

        function lightEmpty(){
            form.find('.empty_field').css({'border-color':'#d8512d'});
            setTimeout(function(){
                form.find('.empty_field').removeAttr('style');
            },500);
        }

        setInterval(function(){
            checkInput();
            var sizeEmpty = form.find('.empty_field').size();
            if(sizeEmpty > 0){
                if(btn.hasClass('disabled')){
                    return false
                } else {
                    btn.addClass('disabled')
                }
            } else {
                btn.removeClass('disabled')
            }
        },500);

        btn.click(function(){
            if($(this).hasClass('disabled')){
                lightEmpty();
                return false
            } else {
                var data = {
                    username: document.forms['login-form'].elements['username'].value,
                    address:  document.forms['login-form'].elements['address'].value,
                    telephone: document.forms['login-form'].elements['telephone'].value,
                    cart: cart
                };
                api.createOrder(data, function (err) {
                    if (err) {
                        alert(err.message);
                    } else {
                        location.href = "/";
                    }
                });
            }
        });
    });


    var allPrize = 0;

    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var price = parseInt(cart_item.pizza[cart_item.size].price);



        allPrize += price * cart_item.quantity;

        console.log(price);
        console.log(cart_item.quantity);
        console.log(allPrize);

        var $node = $(html_code);

        $node.find(".plus").remove();

        $node.find(".minus").remove();

        $order_det.append($node);

        $node.find(".delete").remove();
    }

    cart.forEach(showOnePizzaInCart);

    $footer.prepend("<div class=\"sum\"><span>Сума замовлення:</span><span>" + allPrize + "</span></div>");
    console.log("Success");
}
while(localStorage.getItem("cart") == null){

}
buildPage(JSON.parse(localStorage.getItem("cart")));