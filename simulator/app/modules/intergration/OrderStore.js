OrderStore = function() {
	orderQueue = [];
	orders = [];
	this.matchOrdersSell = [];
	this.matchOrdersBuy = [];
	orderMap = {};
};

OrderStore.prototype = {

	init: function() {
		orders.length = 0;
		orderQueue.length = 0;
		this.matchOrdersSell.length = 0;
		this.matchOrdersBuy.length = 0;
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

	getAllOrderBuy: function() {
		return this.matchOrdersBuy;
	},

	getAllOrderSell: function() {
		return this.matchOrdersSell;
	},

	addOrderSellMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			if (ord.price < this.matchOrdersSell[i].price) {
				this.matchOrdersSell.splice(i, 0, ord);
				return;
			}
		}
		this.matchOrdersSell.push(ord);
	},

	addOrderBuyMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			if (ord.price > this.matchOrdersBuy[i].price) {
				this.matchOrdersBuy.splice(i, 0, ord);
				return;
			}
		}
		this.matchOrdersBuy.push(ord);
	},

	removeOrderBuyMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			if (ord.orderID == this.matchOrdersBuy[i].orderID) {
				this.matchOrdersBuy.splice(i, 1);
				return;
			}
		}
	},

	removeOrderSellMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			if (ord.orderID == this.matchOrdersSell[i].orderID) {
				this.matchOrdersSell.splice(i, 1);
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
