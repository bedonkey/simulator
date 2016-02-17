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
			if (action == "place") {
				this.orderStore.putOrderToQueue({order:ord, action:action});
				console.log('Push to gateway queue')
				return {exec: 'A'};
			}
			if (action == "replace") {
				ord.underlyingPrice = 0;
				ord.underlyingQty = 0;
				var replaceOrd = Utils.clone(ord);
				replaceOrd.status = OrdStatus.REPLACED;
				this.orderStore.pushToMap(ord.originalID, replaceOrd)
				return {exec: 'A'};
			}
			if (action == "cancel") {
				ord.status = OrdStatus.CANCELED;
				ord.remain = 0;
				ord.time = DateTime.getCurentDateTime();
				var cancelOrder = Utils.clone(ord);
				cancelOrder.orderID = IdGenerator.getId();
				this.orderStore.pushToMap(ord.originalID, cancelOrder);
				return {exec: 'A'};
			}
			
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
			console.log(orderQueue[i]);
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
