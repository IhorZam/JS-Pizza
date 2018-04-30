
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

        form.find('#address').focusout(function () {
            var address = document.forms['login-form'].elements['address'].value;
            if (address !== ''){
                console.log("Focused out... address: " + address);
                geocodeAddress(address, function(err, callback){
                    if (err){
                        alert(err.message);
                    }else{
                        console.log('Making marker..');
                        if (userMarker !== makeMarker(callback) && userMarker) {
                            userMarker.setMap(null);
                        }
                        userMarker = makeMarker(callback);
                        userMarker.setMap(map);
                        calculateRoute(myMarker.position, userMarker.position, function (err, callback) {
                            if (err){
                                alert(err.message);
                            }else{
                                console.log(callback);
                                $footer.find('.dur').remove();
                                $footer.append('<div class=\"dur\"><span>Орієнтовний час доставки </span><span>' + callback + "</span></div>");
                            }
                        });
                    }
                });
            }
        });


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

                LiqPayCheckout.init({
                    data:	data.username + "Адреса доставки: " + data.address,
                    signature:	"Підпис...",
                    embedTo:	"#liqpay",
                    mode:	"popup"	//	embed	||	popup
                }).on("liqpay.callback",	function(data){
                    console.log(data.status);
                    console.log(data);
                }).on("liqpay.ready",	function(data){
                    api.createOrder(data, function (err) {
                        if (err) {
                            alert(err.message);
                        } else {
                            location.href = "/";
                        }
                    });
                }).on("liqpay.close",	function(data){
                });
                var order	=	{
                    version:	3,
                    public_key:	LIQPAY_PUBLIC_KEY,
                    action:	"pay",
                    amount:	568.00,
                    currency:	"UAH",
                    description:	"Опис транзакції",
                    order_id:	Math.random(),
//!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
                    sandbox:	1
                };
                var data	=	base64(JSON.stringify(order));
                var signature	=	sha1(LIQPAY_PRIVATE_KEY	+	data	+	LIQPAY_PRIVATE_KEY);
            }
        });
    });


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

    cart.forEach(showOnePizzaInCart);

    $footer.prepend("<div class=\"sum\"><span>Сума замовлення:</span><span>" + allPrize + " грн.</span></div>");

    var myLatlng = new google.maps.LatLng(50.464379,30.519131);
    var map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 11,
        center: myLatlng
    });

    var userMarker;
    var myMarker;

    function makeMarker(coordinates) {
        var marker = new google.maps.Marker({
            position: coordinates,
            icon: "assets/images/map-icon.png"
        });
        return marker;
    }

    myMarker = makeMarker(myLatlng);
    myMarker.setMap(map);

// To add the marker to the map, call setMap();

    function	geocodeLatLng(latlng,	 callback){
//Модуль за роботу з адресою
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'location':	latlng},	function(results,	status)	{
            if	(status	===	google.maps.GeocoderStatus.OK &&	results[1])	{
                var adress =	results[1].formatted_address;
                callback(null,	adress);
            }	else	{
                callback(new	Error("Can't	find	adress"));
            }
        });
    }

    google.maps.event.addListener(map,	'click',function(me){
        var coordinates	=  me.latLng;
        geocodeLatLng(coordinates,	function(err,	adress){
            if(!err)	{
                document.forms['login-form'].elements['address'].value = adress;
                var newMarker = makeMarker(coordinates);
                if (userMarker !== newMarker && userMarker){
                    userMarker.setMap(null);
                }
                userMarker = newMarker;
                userMarker.setMap(map);
                calculateRoute(myMarker.position, userMarker.position, function (err, callback) {
                   if (err){
                       alert(err.message);
                   }else{
                       console.log(callback);
                       $footer.find('.dur').remove();
                       $footer.append('<div class=\"dur\"><span>Орієнтовний час доставки </span><span>' + callback + "</span></div>");
                   }
                });
                console.log(adress);
            }	else	{
                console.log("Немає адреси")
            }
        })
    });

    function geocodeAddress(adress,	 callback)	{
        var geocoder	=	new	google.maps.Geocoder();

        geocoder.geocode({'address': adress},	function(results,	status)	{
            if	(status	===	google.maps.GeocoderStatus.OK && results[0])	{
                var coordinates	=	results[0].geometry.location;
                callback(null,	coordinates);
            }	else	{
                callback(new Error("Can	not	find the adress"));
            }
        });
    }

    function calculateRoute(A_latlng, B_latlng,	callback)	{
        var directionService =	new	google.maps.DirectionsService();
        directionService.route({
            origin:	A_latlng,
            destination:	B_latlng,
            travelMode:	google.maps.TravelMode["DRIVING"]
        },	function(response,	status)	{
            if	(status	===	google.maps.DirectionsStatus.OK )	{
                var leg	=	response.routes[0].legs[0];
                var res = leg.duration['text'];
                callback(null, res);
            }	else	{
                callback(new	Error("Can'	not	find	direction"));
            }
        });
    }

}
while(localStorage.getItem("cart") == null){

}
buildPage(JSON.parse(localStorage.getItem("cart")));