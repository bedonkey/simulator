SecInfo = function(secInfoValidator) {
	this.secInfoValidator = secInfoValidator;
	var secs;
	this.init();
};

SecInfo.prototype = {
	init: function() {
		secs = InitData.secs;
	},

	getAll: function() {
		return secs;
	},

	add: function(sec) {
		var error = this.secInfoValidator.clientValidate(sec);
		if (error != '' &&  this.checkExist(sec.symbol)) {
	        error = "Symbol exist";
	    }
		if (error == "") {
	        secs.push(sec);
        }
        return error;
	},

	get: function(symbol) {
		var newsecs = [];
		for (var i = 0; i < secs.length; i++) {
            if (symbol == undefined || symbol == '' || secs[i].symbol == symbol) {
                newsecs.push(secs[i]);
            }
        };
		return newsecs;
	},

	delete: function(symbol) {
		console.log("delete")
		for (var i = 0; i < secs.length; i++) {
            if (secs[i].symbol == symbol) {
                secs.splice(i, 1);
            }
        };
	},

	checkExist: function(symbol) {
        for (var i = 0; i < secs.length; i++) {
            if (symbol == secs[i].symbol) {
                return true;
            }
        };
        return false;
    }
}	
