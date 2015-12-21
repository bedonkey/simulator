AfType = function(basket) {
	this.basket = basket;
	this.aftypes = InitData.aftypes;
};

AfType.prototype = {
	getAll: function() {
		return this.aftypes;
	},

	add: function(type) {
		var error = "";
		if (this.checkExist(type.name)) {
	        error = "AfType exist";
	    }
		if (error == "") {
	        this.aftypes.push(type);
        }
        return error;
	},

	get: function(name) {
		
	},

	delete: function(name) {
		for (var i = 0; i < this.aftypes.length; i++) {
            if (this.aftypes[i].name == name) {
                this.aftypes.splice(i, 1);
            }
        };
	},

	checkExist: function(name) {
        for (var i = 0; i < this.aftypes.length; i++) {
            if (name == this.aftypes[i].name) {
                return true;
            }
        };
        return false;
    },

    getPriceMargin: function(type, sym) {
    	var basketID = 0;
    	for (var i = 0; i < this.aftypes.length; i++) {
            if (type == this.aftypes[i].name) {
                basketID = this.aftypes[i].basket;
                break;
            }
        };
    	if (basketID != 0) {
    		return this.basket.getPrice(basketID, sym);
    	}
    	return 0;
    }
}	
