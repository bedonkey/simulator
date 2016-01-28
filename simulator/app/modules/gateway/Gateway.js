Gateway = function(orderStore, exchange, sessionManager) {
	this.orderStore = orderStore;
	this.exchange = exchange;
	this.sessionManager = sessionManager;
};

Gateway.prototype = {

	init: function() {
	},

	receive: function(ord, action) {
		if (this.sessionManager.getGatewaySession() == Session.gw.NEW) {
			this.orderStore.putOrderToQueue({order:ord, action:action});
			return {exec: 'A'};
		}

		if (this.sessionManager.getGatewaySession() == Session.gw.OPEN) {
			return {exec: '0', error: this.sendToExchange(ord, action)};
		}

		if (this.sessionManager.getGatewaySession() == Session.gw.CLOSE) {
			return {error:"Gateway is closed"};
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
		orderQueue = this.orderStore.getAllOrderQueueOnGateway();
		for (var i = 0; i < orderQueue.length; i++) {
			this.sendToExchange(orderQueue[i].order, orderQueue[i].action);
			orderQueue[i].order.status = OrdStatus.NEW;
		}
		this.orderStore.clearQueue();
	}
}	
