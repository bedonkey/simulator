Basket = function() {
	this.baskets = InitData.baskets;
};

Basket.prototype = {

	getAll: function() {
		return this.baskets;
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
	        this.baskets.push(bak);
        }
        return error;
	},

	delete: function(id) {
		for (var i = 0; i < this.baskets.length; i++) {
            if (this.baskets[i].id == id) {
                this.baskets.splice(i, 1);
            }
        };
	},

	deleteSymbol: function(id, sym) {
		for (var i = 0; i < this.baskets.length; i++) {
            if (this.baskets[i].id == id) {
            	var data = this.baskets[i].data;
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
        for (var i = 0; i < this.baskets.length; i++) {
            if (id == this.baskets[i].id) {
                return true;
            }
        };
        return false;
    },

    getPrice: function(id, sym) {
    	for (var i = 0; i < this.baskets.length; i++) {
            if (id == this.baskets[i].id) {
            	var data = this.baskets[i].data;
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
