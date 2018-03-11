/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var $left_part = $(".left-part");


function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    var counter = list.length;

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});
        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, "big_size");
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, "small_size");
        });

        $pizza_list.append($node);
    }
    $left_part.find(".num_of").remove();
    $left_part.find(".title").append("<span class=\"num_of\">" + counter + "</span>");

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    if (filter === 'vega'){
        Pizza_List.forEach(function(pizza){
            if (pizza.id === 17) {
                pizza_shown.push(pizza);
            }
        });
    }else if (filter === "all") {
        showPizzaList(Pizza_List);
        return;
    }else{
        Pizza_List.forEach(function (pizza) {
            if (pizza.content.hasOwnProperty(filter)) {
                pizza_shown.push(pizza);
            }
        });
    }
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function updateListeners() {

    $("#menu-all").click(function () {
        updateList();
        $(this).removeClass("btn-default");
        $(this).addClass("btn-warning");
        filterPizza("all")
    });
    $("#menu-meat").click(function () {
        updateList();
        $(this).removeClass("btn-default");
        $(this).addClass("btn-warning");
        filterPizza("meat")
    });
    $("#menu-spongebob-house").click(function () {
        updateList();
        $(this).removeClass("btn-default");
        $(this).addClass("btn-warning");
        filterPizza("pineapple")
    });
    $("#menu-mushrooms").click(function () {
        updateList();
        $(this).removeClass("btn-default");
        $(this).addClass("btn-warning");
        filterPizza("mushroom")
    });
    $("#menu-squirdwart").click(function () {
        updateList();
        $(this).removeClass("btn-default");
        $(this).addClass("btn-warning");
        filterPizza("ocean")
    });
    $("#menu-green").click(function () {
        updateList();
        $(this).removeClass("btn-default");
        $(this).addClass("btn-warning");
        filterPizza("vega")
    });
}

function updateList(){
    var $navi = $left_part.find(".nav-pills");
    var $children = $navi.children();
    for(var i = 0;i < $children.length;i++){
        $children.eq(i).removeClass("btn-warning");
        $children.eq(i).addClass("btn-default");
    }
}

function initialiseMenu() {
    showPizzaList(Pizza_List);
    updateListeners();
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;