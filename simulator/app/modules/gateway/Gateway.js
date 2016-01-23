Gateway = function(orderStore, exchange, sessionManager) {
	this.orderStore = orderStore;
	this.exchange = exchange;
	this.sessionManager = sessionManager;
	this.orderQueue = this.orderStore.getAllOrderQueueOnGateway();
};

Gateway.prototype = {

	init: function() {
	},

	receive: function(ord, action) {
		if (this.sessionManager.getGatewaySession() == Session.gw.NEW) {
			this.orderStore.putOrderToQueue({order:ord, action:action});
		}

		if (this.sessionManager.getGatewaySession() == Session.gw.OPEN) {
			this.sendToExchange(ord, action);
		}

		if (this.sessionManager.getGatewaySession() == Session.gw.CLOSE) {
			return "Gateway is closed";
		}
		
	},

	sendToExchange: function(ord, action) {
		if (action == 'place') {
			return this.exchange.place(ord);
		}
		if (action == 'replace') {
			return this.exchange.replace(ord);
		}
		if (action == 'cancel') {
			return this.exchange.cancel(ord);
		}
	},

	fireOrder: function() {
		for (var i = 0; i < this.orderQueue.length; i++) {
			this.sendToExchange(this.orderQueue[i].order, this.orderQueue[i].action);
			this.orderQueue.splice(i, 1);
		}
	}
}	
