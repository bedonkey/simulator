OrderStore = function() {
	this.orderQueue = [];
	this.orders = [];
	this.matchOrdersSell = [];
	this.matchOrdersBuy = [];
	this.orderMap = {};
};

OrderStore.prototype = {

	init: function() {
		this.orders.length = 0;
		this.orderQueue.length = 0;
		this.matchOrdersSell.length = 0;
		this.matchOrdersBuy.length = 0;
	},

	getAll: function() {
		return this.orders;
	},

	getAllOrderQueueOnGateway: function() {
		return this.orderQueue;
	},

	putOrderToQueue: function(obj) {
		this.orderQueue.push(obj);
	},

	clearQueue: function() {
		this.orderQueue.length = 0;
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
		this.orders.push(ord);
	},

	getNewOrder: function(ordID) {
        for (var i = 0; i < this.orders.length; i++) {
            if (this.orders[i].orderID == ordID && this.isAvailable(this.orders[i])) {
                return this.orders[i];
            }
        };
        return null;
	},

	getPendingNewOrder: function() {
		var pendingNewOrders = [];
		for (var i = 0; i < this.orders.length; i++) {
            if (this.orders[i].status == OrdStatus.PENDING_NEW) {
                pendingNewOrders.push(this.orders[i]);
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
        if (ordID in this.orderMap) {
            return this.orderMap[ordID];
        }
        return null;
	},

	pushToMap: function(id, ord) {
		var listOrder;
        if (id in this.orderMap) {
        	listOrder = this.orderMap[id];
        } else {
        	listOrder = [];
        }
        listOrder.push(ord);
        this.orderMap[id] = listOrder;
	},

	getOppositeOrder: function(ord) {
		for (var i = 0; i < this.orders.length; i++) {
			if (ord.side == Side.BUY && this.isAvailable(this.orders[i])) {
				if (this.orders[i].side == Side.SELL && this.orders[i].account == ord.account && this.orders[i].symbol == ord.symbol) {
					return this.orders[i];
				}
			}

			if (ord.side == Side.SELL && this.isAvailable(this.orders[i])) {
				if (this.orders[i].side == Side.BUY && this.orders[i].account == ord.account && this.orders[i].symbol == ord.symbol) {
					return this.orders[i];
				}
			}
		};
        return null;
	}

}	
