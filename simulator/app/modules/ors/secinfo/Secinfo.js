SecInfo = function(secInfoValidator) {
	this.secInfoValidator = secInfoValidator;
	this.secs = InitData.secs;
};

SecInfo.prototype = {

	getAll: function() {
		return this.secs;
	},

	getExchange: function(sym) {
		for (var i = 0; i < this.secs.length; i++) {
            if (this.secs[i].symbol == sym) {
                return this.secs[i].exchange;
            }
        };
	},

	add: function(sec) {
		var error = this.secInfoValidator.clientValidate(sec);
		if (error != '' &&  this.checkExist(sec.symbol)) {
	        error = "Symbol exist";
	    }
		if (error == "") {
			console.log(sec)
	        this.secs.push(sec);
        }
        return error;
	},

	get: function(symbol) {
		var newsecs = [];
		for (var i = 0; i < this.secs.length; i++) {
            if (symbol == undefined || symbol == '' || this.secs[i].symbol == symbol) {
                newsecs.push(this.secs[i]);
            }
        };
		return newsecs;
	},

	delete: function(symbol) {
		for (var i = 0; i < this.secs.length; i++) {
            if (this.secs[i].symbol == symbol) {
                this.secs.splice(i, 1);
            }
        };
	},

	checkExist: function(symbol) {
        for (var i = 0; i < this.secs.length; i++) {
            if (symbol == this.secs[i].symbol) {
                return true;
            }
        };
        return false;
    }
}