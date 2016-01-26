OrderStore = function() {
	orderQueue = [];
	orders = [];
	matchOrdersSell = [];
	matchOrdersBuy = [];
	orderMap = {};
};

OrderStore.prototype = {

	init: function() {
		orders.length = 0;
		orderQueue.length = 0;
		matchOrdersSell.length = 0;
		matchOrdersBuy.length = 0;
	},

	getAll: function() {
		return orders;
	},

	getAllOrderQueueOnGateway: function() {
		return orderQueue;
	},

	putOrderToQueue: function(obj) {
		orderQueue.push(obj);
	},

	clearQueue: function() {
		orderQueue.length = 0;
	},

	getAllOrderBuy: function() {
		return matchOrdersBuy;
	},

	getAllOrderSell: function() {
		return matchOrdersSell;
	},

	addOrderSellMatch: function(ord) {
		for (var i = 0; i < matchOrdersSell.length; i++) {
			if (ord.price < matchOrdersSell[i].price) {
				matchOrdersSell.splice(i, 0, ord);
				return;
			}
		}
		matchOrdersSell.push(ord);
	},

	addOrderBuyMatch: function(ord) {
		for (var i = 0; i < matchOrdersBuy.length; i++) {
			if (ord.price > matchOrdersBuy[i].price) {
				matchOrdersBuy.splice(i, 0, ord);
				return;
			}
		}
		matchOrdersBuy.push(ord);
	},

	removeOrderBuyMatch: function(ord) {
		for (var i = 0; i < matchOrdersBuy.length; i++) {
			if (ord.orderID == matchOrdersBuy[i].orderID) {
				matchOrdersBuy.splice(i, 1);
				return;
			}
		}
	},

	removeOrderSellMatch: function(ord) {
		for (var i = 0; i < matchOrdersSell.length; i++) {
			if (ord.orderID == matchOrdersSell[i].orderID) {
				matchOrdersSell.splice(i, 1);
				return;
			}
		}
	},

	add: function(ord) {
		orders.push(ord);
	},

	getNewOrder: function(ordID) {
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].orderID == ordID && this.isAvailable(orders[i])) {
                return orders[i];
            }
        };
        return null;
	},

	getPendingNewOrder: function() {
		var pendingNewOrders = [];
		for (var i = 0; i < orders.length; i++) {
            if (orders[i].status == OrdStatus.PENDING_NEW) {
                pendingNewOrders.push(orders[i]);
            }
        };
        return pendingNewOrders;
	},

	isAvailable: function(ord) {
		if((ord.status == OrdStatus.NEW || ord.status == OrdStatus.PARTIAL_FILLED || ord.status == OrdStatus.PENDING_NEW)) {
			return true;
		}
		return false;
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
			if (ord.side == Side.BUY && this.isAvailable(orders[i])) {
				if (orders[i].side == Side.SELL && orders[i].account == ord.account && orders[i].symbol == ord.symbol) {
					return orders[i];
				}
			}

			if (ord.side == Side.SELL && this.isAvailable(orders[i])) {
				if (orders[i].side == Side.BUY && orders[i].account == ord.account && orders[i].symbol == ord.symbol) {
					return orders[i];
				}
			}
		};
        return null;
	}

}	
