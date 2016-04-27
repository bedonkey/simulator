OrderStore = function() {
	this.gwQueue = [];
	this.orders = [];
	this.matchOrdersSell = [];
	this.matchOrdersBuy = [];
	this.orderMap = {};
};

OrderStore.prototype = {

	init: function() {
		this.orders.length = 0;
		this.gwQueue.length = 0;
		this.matchOrdersSell.length = 0;
		this.matchOrdersBuy.length = 0;
	},

	getAll: function() {
		return this.orders;
	},

	gerOrderById: function(ordID) {
		for (var i = 0; i < this.orders.length; i++) {
            if (this.orders[i].orderID == ordID) {
                return this.orders[i];
            }
        };
        return null;
	},

	getAllOrderQueueOnGateway: function() {
		return this.gwQueue;
	},

	putOrderToGWQueue: function(obj) {
		this.gwQueue.push(obj);
	},

	checkOrderInGWQueue: function(ordID) {
		for (var i = 0; i < this.gwQueue.length; i++) {
            if (this.gwQueue[i].order.orderID == ordID) {
                return true;
            }
        };
		return false;
	},

	clearGWQueue: function(ex) {
		for (var i = this.gwQueue.length-1 ; i >= 0; i--) {
			if (this.gwQueue[i].order.ex == ex && this.gwQueue[i].order.type != 'ATC') {
				this.gwQueue.splice(i, 1);
			}
		}
	},

	clearGWATCQueue: function(ex) {
		for (var i = this.gwQueue.length-1 ; i >= 0; i--) {
			if (this.gwQueue[i].order.ex == ex && this.gwQueue[i].order.type == 'ATC') {
				this.gwQueue.splice(i, 1);
			}
		}
	},

	getAllOrderBuy: function() {
		return this.matchOrdersBuy;
	},

	getAllOrderSell: function() {
		return this.matchOrdersSell;
	},

	addOrderSellMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			if (ord.price < this.matchOrdersSell[i].price || this.matchOrdersSell[i].price == 0) {
				this.matchOrdersSell.splice(i, 0, ord);
				return;
			}
		}
		this.matchOrdersSell.push(ord);
	},

	addOrderBuyMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			if (this.matchOrdersBuy[i].price == 0) {
				this.matchOrdersBuy.splice(0, 0, ord);
				return;
			}
			if (ord.price > this.matchOrdersBuy[i].price ) {
				this.matchOrdersBuy.splice(i, 0, ord);
				return;
			}
		}
		this.matchOrdersBuy.push(0, 0, ord);
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
