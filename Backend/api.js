

var Pizza_List = require('./data/Pizza_List');
var crypto	=	require('crypto');

exports.getPizzaList = function(req, res) {
    console.log("Success");
    res.send(
        {
            list: Pizza_List,
            success: true
        });
};

exports.createOrder = function(req, res) {
    var order_info = req.body;

    function base64(str)	 {
        return	new	Buffer(str).toString('base64');
    }
    function sha1(string)	{
        var sha1	=	crypto.createHash('sha1');
        sha1.update(string);
        return	sha1.digest('base64');
    }

    var allPizza = "";
    order_info.cart.forEach(function (element) {
        console.log(element);
       allPizza += "- " + element.quantity + "шт. [" + element.size + "] " +  element.pizza['title'] + "\n";
    });

    console.log("Creating Order", order_info);
    var order	=	{
        version: 3,
        public_key: 'i14555202684',
        action: "pay",
        amount: order_info.sum,
        currency: "UAH",
        description: "Замовлення піцци: " + order_info.username + "\n" +
                    "Адреса: " + order_info.address + "\n" +
                        "Номер телефону: " + order_info.telephone + "\n" +
                    "Замовлення: \n" +
                        allPizza +
                    "Всього: " + order_info.sum.toString() + " грн.",
        order_id: Math.random(),
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature =	sha1('cLxxAJYoEx9CKIqjQKXOJY6i1XFO4CRRAKsQOcWU'	+ data + 'cLxxAJYoEx9CKIqjQKXOJY6i1XFO4CRRAKsQOcWU');
    res.send({
        success: true,
        data: data,
        signature: signature
    });

};