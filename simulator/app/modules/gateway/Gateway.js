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
			console.log('Push to gateway queue')
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
		}
		this.orderStore.clearQueue();
	},

	setSession: function(session) {
		if (session == Session.gw.OPEN) {
            console.log("Push order to Exchange");
            this.fireOrder();
        }
        this.sessionManager.setGatewaySession(session);
	},

	getSession: function() {
		return this.sessionManager.getGatewaySession();
	}
}	
