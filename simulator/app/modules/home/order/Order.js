Order = function(orderValidator, afType, orderStore, account, priceBoard, exchange, sessionManager) {
	this.orderValidator = orderValidator;
	this.orderStore = orderStore;
	this.account = account;
	this.priceBoard = priceBoard;
	this.exchange = exchange;
	this.afType = afType;
	this.sessionManager = sessionManager;
};

Order.prototype = {
	place: function(ord) {
		var result = {};
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
			if (this.sessionManager.getORSSession() == Session.ors.OPEN) {
				ord.status = OrdStatus.NEW;
				var newOrder = Utils.clone(ord);
	        	this.orderStore.add(newOrder);
				error = this.exchange.place(newOrder);
				if (error != undefined) {
					newOrder.status = OrdStatus.REJECTED;
					newOrder.text = error;
					this.orderStore.pushToMap(ord.originalID, newOrder);
					result.status = false;
	        		result.msg = error;
	        		return result;
				}
				this.priceBoard.add(newOrder);
			}
			if (this.sessionManager.getORSSession() == Session.ors.NEW) {
				ord.status = OrdStatus.PENDING_NEW;
				var newOrder = Utils.clone(ord);
	        	this.orderStore.add(newOrder);
			}

	        this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
			if(ord.side == Side.BUY) {
				this.account.hold(ord);
			} else {
				this.account.holdTrade(ord.account, ord.symbol, ord.qty);
			}
			
            result.status = true;
        	result.msg = ord.orderID;
        } else {
	    	var newOrder = Utils.clone(ord);
        	newOrder.status = OrdStatus.ORS_REJECTED;
        	newOrder.text = error;
        	this.orderStore.add(newOrder);
	        this.orderStore.pushToMap(ord.originalID, newOrder);
        	result.status = false;
        	result.msg = error;
        }
        return result;
	},

	fireOrder: function () {
		console.log('Fire');
		var orders = this.orderStore.getPendingNewOrder();
		for (var i = 0; i < orders.length; i++) {
			this.sendOrderToGateway(orders[i]);
		}
	},

	sendOrderToGateway: function(ord) {
		ord.status = OrdStatus.NEW;
		var newOrder = Utils.clone(ord);
		error = this.exchange.place(newOrder);
		if (error != undefined) {
			newOrder.status = OrdStatus.REJECTED;
			newOrder.text = error;
			this.orderStore.pushToMap(ord.originalID, newOrder);
			result.status = false;
    		result.msg = error;
    		return result;
		}
		this.priceBoard.add(newOrder);
		this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
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
			result.status = false;
        	result.msg = error;
        	return result;
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
			
			error = this.exchange.replace(oldOrd);
        	if (error != undefined) {
				newOrder.status = OrdStatus.REJECTED;
				this.orderStore.pushToMap(ord.originalID, newOrder);
				result.status = false;
        		result.msg = error;
        		return result;
			}

			newOrder.status = OrdStatus.REPLACED;
    		this.orderStore.pushToMap(newOrder.originalID, newOrder);
        	this.priceBoard.add(newOrder);

        	if(oldOrd.side == Side.BUY) {
				this.account.hold(newOrder);
			} else {
				this.account.holdTrade(newOrder.account, newOrder.symbol, newOrder.qty);
			}
			result.status = true;
        	result.msg = oldOrd.orderID;
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
        	result.status = false;
        	result.msg = error;
        }
        return result;
	},

	cancel: function(ord) {
		var error = undefined;
		var result = {};
		var order = this.orderStore.getNewOrder(ord.orderID);
		if (order == null) {
        	error = ErrorCode.ORS_02;
        	result.status = false;
        	result.msg = error;
        	return result;
		}
		if (error == undefined) error = this.orderValidator.validateCancel();
		if (error == undefined) {
			var pendingCancel = Utils.clone(order);
    		pendingCancel.status = OrdStatus.PENDING_CANCEL;
			this.orderStore.pushToMap(ord.originalID, pendingCancel);

			error = this.exchange.cancel(order);
        	if (error != undefined) {
				newOrder.status = OrdStatus.REJECTED;
				this.orderStore.pushToMap(ord.originalID, order);
				result.status = false;
        		result.msg = error;
        		return result;
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
			result.status = true;
        	result.msg = '';
		} else {
			var cancelOrder = Utils.clone(order);
			cancelOrder.status = OrdStatus.ORS_REJECTED;
			cancelOrder.remain = 0;
			cancelOrder.time = DateTime.getCurentDateTime();
			cancelOrder.orderID = IdGenerator.getId();
			this.orderStore.pushToMap(order.originalID, cancelOrder);
        	result.status = false;
        	result.msg = error;
		}
		return result;
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
			result.status = true;
        	result.msg = '';
		} else {
        	result.status = false;
        	result.msg = error;
		}
		return result;
	},

}	
