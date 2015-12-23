OrderStore = function() {
	orders = [];
	orderMap = {};
};

OrderStore.prototype = {

	init: function() {
		orders.length = 0;
	},

	getAll: function() {
		return orders;
	},

	add: function(ord) {
		orders.push(ord);
	},

	getNewOrder: function(ordID) {
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].orderID == ordID && (orders[i].status == 'New' || orders[i].status == 'Partial Filled')) {
                return orders[i];
            }
        };
        return null;
	},

	getDetail: function(ordID) {
        if (ordID in orderMap) {
            return orderMap[ordID];
        }
        return null;
	},

	pushToMap: function(id, ord) {
		var listOrder;
        if (id in orderMap) {
        	listOrder = orderMap[id];
        } else {
        	listOrder = [];
        }
        listOrder.push(ord);
        orderMap[id] = listOrder;
	},

	getOppositeOrder: function(ord) {
		for (var i = 0; i < orders.length; i++) {
			if (ord.side == "Buy") {
				if (orders[i].side == "Sell" && orders[i].account == ord.account&& orders[i].symbol == ord.symbol) {
					return orders[i];
				}
			}

			if (ord.side == "Sell") {
				if (orders[i].side == "Buy" && orders[i].account == ord.account&& orders[i].symbol == ord.symbol) {
					return orders[i];
				}
			}
		};
        return null;
	}

}	
