

var Pizza_List = require('./data/Pizza_List');

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
    console.log("Creating Order", order_info);
    res.send({
        success: true
    });
};