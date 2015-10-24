AfType = function(basket) {
	this.basket = basket;
	var aftypes;
	this.init();
};

AfType.prototype = {
	init: function() {
		aftypes = InitData.aftypes;
	},

	getAll: function() {
		return aftypes;
	},

	add: function(type) {
		var error = "";
		if (this.checkExist(type.name)) {
	        error = "AfType exist";
	    }
		if (error == "") {
	        aftypes.push(type);
        }
        return error;
	},

	get: function(name) {
		
	},

	delete: function(name) {
		for (var i = 0; i < aftypes.length; i++) {
            if (aftypes[i].name == name) {
                aftypes.splice(i, 1);
            }
        };
	},

	checkExist: function(name) {
        for (var i = 0; i < aftypes.length; i++) {
            if (name == aftypes[i].name) {
                return true;
            }
        };
        return false;
    },

    getPriceMargin: function(type, sym) {
    	var basketID = 0;
    	for (var i = 0; i < aftypes.length; i++) {
            if (type == aftypes[i].name) {
                basketID = aftypes[i].basket;
                break;
            }
        };
    	if (basketID != 0) {
    		return this.basket.getPrice(basketID, sym);
    	}
    	return 0;
    }
}	
