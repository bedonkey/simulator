Order = function(orderValidator, afType, orderStore, account, priceBoard, gateway, sessionManager) {
	this.orderValidator = orderValidator;
	this.orderStore = orderStore;
	this.account = account;
	this.priceBoard = priceBoard;
	this.gateway = gateway;
	this.afType = afType;
	this.sessionManager = sessionManager;
};

Order.prototype = {
	place: function(ord) {
		ord.orderID = IdGenerator.getId();
        ord.originalID = ord.orderID;
        ord.time = DateTime.getCurentDateTime();
        ord.avgQty = 0;
        ord.avgPX = 0;
        ord.remain = ord.qty;
		var error = this.orderValidator.clientValidate(ord);
		if (error == undefined) {
			if (this.orderStore.getOppositeOrder(ord) != null) {
				error = ErrorCode.ORS_04;
			}
		}
		if (error == undefined) {
			error = this.orderValidator.validatePlace(ord);
		}
		if (error == undefined) {
	    	var acc = this.account.getByID(ord.account);
	    	ord.priceMargin = this.afType.getPriceMargin(acc.afType, ord.symbol);
	    	if (this.sessionManager.getORSSession() == Session.ors.NEW) {
				ord.status = OrdStatus.PENDING_NEW;
			}
			if (this.sessionManager.getORSSession() == Session.ors.OPEN) {
				var result = this.gateway.receive(ord, 'place');
				if (result.error != undefined) {
					ord.status = OrdStatus.REJECTED;
					ord.text = result.error;
					this.orderStore.add(ord);
					this.orderStore.pushToMap(ord.originalID, ord);
	        		return {status: false, msg: result.error};
				}
				if (ord.status == undefined) {
					if (result.exec == 'A') {
						ord.status = OrdStatus.PENDING_NEW;
					} else if (result.exec == '0') {
						ord.status = OrdStatus.NEW;
					}
				}
				this.priceBoard.add(ord);
			}
			this.orderStore.add(ord);
	        this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
			if(ord.side == Side.BUY) {
				this.account.hold(ord);
			} else {
				this.account.holdTrade(ord.account, ord.symbol, ord.qty);
			}
        	return {status: true, msg: ord.orderID};
        } else {
	    	this.processORSReject(ord, error);
        	return {status: false, msg: error};
        }
	},

	processORSReject: function(ord, error) {
    	ord.status = OrdStatus.ORS_REJECTED;
    	ord.text = error;
    	this.orderStore.add(ord);
        this.orderStore.pushToMap(ord.originalID, ord);
	},

	fireOrder: function () {
		console.log('ORS Fire');
		var orders = this.orderStore.getPendingNewOrder();
		for (var i = 0; i < orders.length; i++) {
			this.sendOrderToGateway(orders[i]);
		}
	},

	sendOrderToGateway: function(ord) {
		var result = this.gateway.receive(ord, 'place');
		if (result.error != undefined) {
			ord.status = OrdStatus.REJECTED;
			ord.text = result.error;
			this.orderStore.pushToMap(ord.originalID, ord);
		}
		this.priceBoard.add(ord);
		this.orderStore.pushToMap(ord.originalID, ord);
	},

	replace: function(ord) {
		var result = {};
		var oldOrd = this.orderStore.getNewOrder(ord.orderID);
		var pendingReplace = Utils.clone(oldOrd);
		pendingReplace.status = OrdStatus.PENDING_REPLACE;
		this.orderStore.pushToMap(ord.originalID, pendingReplace);
		if (oldOrd != null) {
			error = this.orderValidator.validateReplace(oldOrd, ord);
		} else {
			error = ErrorCode.ORS_02;
        	return {status: false, msg: error};
		}
		if (error == undefined) {
			if(oldOrd.side == Side.BUY) {
				this.account.unHold(oldOrd);
			} else {
				this.account.unHoldTrade(oldOrd.account, oldOrd.symbol, oldOrd.qty);
			}
			this.priceBoard.remove(oldOrd);
			oldOrd.price = ord.price;
			oldOrd.qty = ord.qty;
			oldOrd.remain = ord.qty - oldOrd.avgQty;

			oldOrd.orderID = IdGenerator.getId();
			oldOrd.time = DateTime.getCurentDateTime();
			var acc = this.account.getByID(ord.account);
    		oldOrd.priceMargin = this.afType.getPriceMargin(acc.afType, oldOrd.symbol);
			var newOrder = Utils.clone(oldOrd);
			if (this.sessionManager.getORSSession() == Session.ors.OPEN) {
				var result = this.gateway.receive(oldOrd, 'replace');
	        	if (result.error != undefined) {
					newOrder.status = OrdStatus.REJECTED;
					this.orderStore.pushToMap(ord.originalID, newOrder);
	        		return {status: false, msg: result.error};
				}
			}
			newOrder.status = OrdStatus.REPLACED;
    		this.orderStore.pushToMap(newOrder.originalID, newOrder);
        	this.priceBoard.add(newOrder);

        	if(oldOrd.side == Side.BUY) {
				this.account.hold(newOrder);
			} else {
				this.account.holdTrade(newOrder.account, newOrder.symbol, newOrder.qty);
			}
        	return {status: true, msg: oldOrd.orderID};
        } else {
        	var newOrder = Utils.clone(oldOrd);
        	newOrder.status = OrdStatus.ORS_REJECTED;
        	newOrder.price = ord.price;
			newOrder.qty = ord.qty;
			newOrder.remain = ord.qty - oldOrd.avgQty;
			newOrder.orderID = IdGenerator.getId();
			newOrder.time = DateTime.getCurentDateTime();
			newOrder.text = error;
    		this.orderStore.pushToMap(newOrder.originalID, newOrder);
        	return {status: false, msg: error};
        }
	},

	cancel: function(ord) {
		var error = undefined;
		var result = {};
		var order = this.orderStore.getNewOrder(ord.orderID);
		if (order == null) {
        	error = ErrorCode.ORS_02;
        	return {status: false, msg: error};
		}
		if (error == undefined) error = this.orderValidator.validateCancel();
		if (error == undefined) {
			var pendingCancel = Utils.clone(order);
    		pendingCancel.status = OrdStatus.PENDING_CANCEL;
			this.orderStore.pushToMap(ord.originalID, pendingCancel);
			if (this.sessionManager.getORSSession() == Session.ors.OPEN) {
				var result = this.gateway.receive(order, 'cancel');
	        	if (result.error != undefined) {
					order.status = OrdStatus.REJECTED;
					this.orderStore.pushToMap(ord.originalID, order);
	        		return {status: false, msg: result.error};
				}
			}
			if(order.side == Side.BUY) {
				this.account.unHold(order);
			} else {
				this.account.unHoldTrade(order.account, order.symbol, order.remain);
			}
			order.status = OrdStatus.CANCELED;
			order.remain = 0;
			order.time = DateTime.getCurentDateTime();
			
			var cancelOrder = Utils.clone(order);
			cancelOrder.orderID = IdGenerator.getId();
			this.orderStore.pushToMap(order.originalID, cancelOrder);
			this.priceBoard.remove(order);
        	return {status: true, msg: ''};
		} else {
			var cancelOrder = Utils.clone(order);
			cancelOrder.status = OrdStatus.ORS_REJECTED;
			cancelOrder.remain = 0;
			cancelOrder.time = DateTime.getCurentDateTime();
			cancelOrder.orderID = IdGenerator.getId();
			this.orderStore.pushToMap(order.originalID, cancelOrder);
        	return {status: false, msg: error};
		}
	},

	unhold: function(ord) {
		var error = undefined;
		var result = {};
		var order = this.orderStore.getNewOrder(ord.orderID);
		if (order == null) error = ErrorCode.ORS_02;
		if (error == undefined) error = this.orderValidator.validateUnhold();
		if (error == undefined) {
			if(order.side == Side.BUY) {
				this.account.unHold(order);
			} else {
				this.account.unHoldTrade(order.account, order.symbol, order.remain);
			}
			order.status = OrdStatus.DONE_FOR_DAY;
			order.remain = 0;
			order.time = DateTime.getCurentDateTime();
			var cancelOrder = Utils.clone(order);
			cancelOrder.orderID = IdGenerator.getId();
			this.orderStore.pushToMap(order.originalID, cancelOrder);
			this.priceBoard.remove(order);
        	return {status: true, msg: ''};
		} else {
        	return {status: false, msg: error};
		}
	},

	getOrderStatus: function(ordId) {
		var order = this.orderStore.gerOrderById(ordId);
		if (order != null) {
			return order.status;
		}
		return null;
	}

}	
