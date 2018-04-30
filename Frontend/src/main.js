/**
 * Created by chaika on 25.01.16.
 */


//api liqpay public key i8226183233
//api liqpay private key BJCvjgYiI0vJZhOalVQZGIKeDefrFPwQ7TwetY09


$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();



});