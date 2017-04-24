	var fs = require('fs');
	var gm = require('gm');
	
	gm('./test01.jpg')
		.crop(100, 100, 100, 100)
	    .resize(50, 50,"!")
	    .write('./danny2.jpg', function (err) {
	        if (err) {
	            console.log(err);
	        }
	    });
