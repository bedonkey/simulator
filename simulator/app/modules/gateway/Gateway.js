Gateway = function(orderStore, exchange, sessionManager) {
	this.orderStore = orderStore;
	this.exchange = exchange;
	this.sessionManager = sessionManager;
};

Gateway.prototype = {

	init: function() {
	},

	receive: function(ord, action) {
		var ex = "HNX";
		if (this.sessionManager.getGatewaySession()[ex] == Session.NEW) {
			if (action == "place") {
				this.orderStore.putOrderToGWQueue({order:ord, action:action});
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
				return {};
			}
		}

		if (this.sessionManager.getGatewaySession()[ex] == Session.INTERMISSION) {
			if (action == "place") {
				this.orderStore.putOrderToGWQueue({order:ord, action:action});
				console.log('Push to gateway queue')
				return {exec: 'A'};
			}
			if (action == "cancel") {
				if (this.orderStore.checkOrderInGWQueue(ord.orderID)) {
					ord.status = OrdStatus.CANCELED;
					ord.remain = 0;
					ord.time = DateTime.getCurentDateTime();
					var cancelOrder = Utils.clone(ord);
					cancelOrder.orderID = IdGenerator.getId();
					this.orderStore.pushToMap(ord.originalID, cancelOrder);
				} else {
					this.orderStore.putOrderToGWQueue({order:ord, action:action});
				}
				return {};
			}
			if (action == "replace") {
				ord.underlyingPrice = 0;
				ord.underlyingQty = 0;
				var replaceOrd = Utils.clone(ord);
				replaceOrd.status = OrdStatus.REPLACED;
				this.orderStore.pushToMap(ord.originalID, replaceOrd)
				return {exec: 'A'};
			}
		}

		if (this.sessionManager.getGatewaySession()[ex].indexOf(Session.OPEN) > -1) {
			return this.sendToExchange(ord, action);
		}

		if (this.sessionManager.getGatewaySession()[ex] == Session.CLOSE) {
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
		this.orderStore.clearGWQueue();
	},

	setSession: function(ex, session) {
		if (session.indexOf(Session.OPEN) > -1) {
            console.log("Push order to Exchange");
            this.fireOrder();
        }
        this.sessionManager.setGatewaySession(ex, session);
	},

	getSession: function(ex) {
		return this.sessionManager.getGatewaySession(ex);
	}
}	
