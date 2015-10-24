Basket = function() {
	var baskets;
	this.init();
};

Basket.prototype = {
	init: function() {
		baskets = InitData.baskets;
	},

	getAll: function() {
		return baskets;
	},

	add: function(bak) {
		var error = "";
		if (bak.id == undefined || bak.id == "") {
	        error = "BasketID not empty";
	    }
		if (this.checkExist(bak.id)) {
	        error = "Basket exist";
	    }
		if (error == "") {
	        baskets.push(bak);
        }
        return error;
	},

	delete: function(id) {
		for (var i = 0; i < baskets.length; i++) {
            if (baskets[i].id == id) {
                baskets.splice(i, 1);
            }
        };
	},

	deleteSymbol: function(id, sym) {
		for (var i = 0; i < baskets.length; i++) {
            if (baskets[i].id == id) {
            	var data = baskets[i].data;
            	for (var j = 0; j < data.length; j++) {
            		if (data[j].symbol == sym) {
            			data.splice(j, 1);
            			return;
            		}
            	}
                
            }
        };
	},

	checkExist: function(id) {
        for (var i = 0; i < baskets.length; i++) {
            if (id == baskets[i].id) {
                return true;
            }
        };
        return false;
    },

    getPrice: function(id, sym) {
    	for (var i = 0; i < baskets.length; i++) {
            if (id == baskets[i].id) {
            	var data = baskets[i].data;
            	for (var j = 0; j < data.length; j++) {
            		if (data[j].symbol == sym) {
            			return data[j].price;
            		}
                	
            	}
            }
        };
        return 0;
    }
}	
