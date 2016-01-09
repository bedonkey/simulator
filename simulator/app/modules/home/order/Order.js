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
		if (this.sessionManager.getORSSession() == Session.ors.CLOSE) {
			error = "ORS session is close";
		}
		if (error == undefined) {
			if (this.orderStore.getOppositeOrder(ord) != null) {
				error = "Has pending trade balance";
			}
		}
		if (error == undefined) {
			error = this.orderValidator.validatePlace(ord);
		}
		if (error == undefined) {
			ord.status = "New";
	    	var acc = this.account.getByID(ord.account);
	    	ord.priceMargin = this.afType.getPriceMargin(acc.afType, ord.symbol);
	    	var newOrder = Utils.clone(ord);
	        this.orderStore.add(newOrder);
			error = this.exchange.place(newOrder);
			if (error != undefined) {
				newOrder.status = "Rejected";
				newOrder.text = error;
				this.orderStore.pushToMap(ord.originalID, newOrder);
				result.status = false;
        		result.msg = error;
        		return result;
			}
	        this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
			if(ord.side == 'Buy') {
				this.account.hold(ord);
			} else {
				this.account.holdTrade(ord.account, ord.symbol, ord.qty);
			}
			this.priceBoard.add(newOrder);
            result.status = true;
        	result.msg = ord.orderID;
        } else {
	    	var newOrder = Utils.clone(ord);
        	newOrder.status = "ORS Rejected";
        	newOrder.text = error;
        	this.orderStore.add(newOrder);
	        this.orderStore.pushToMap(ord.originalID, newOrder);
        	result.status = false;
        	result.msg = error;
        }
        return result;
	},

	replace: function(ord) {
		var result = {};
		var oldOrd = this.orderStore.getNewOrder(ord.orderID);
		var pendingReplace = Utils.clone(oldOrd);
		pendingReplace.status = "Pending Replace";
		this.orderStore.pushToMap(ord.originalID, pendingReplace);
		if (oldOrd != null) {
			error = this.orderValidator.validateReplace(oldOrd, ord);
		} else {
			error = "Order not found";
			result.status = false;
        	result.msg = error;
        	return result;
		}
		if (this.sessionManager.getORSSession() == Session.ors.CLOSE) {
			error = "ORS session is close";
		}
		if (ord.qty <= oldOrd.avgQty) {
			error = "Not Enough qty";
		}
		if (error == undefined) {
			if(oldOrd.side == 'Buy') {
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
				newOrder.status = "Rejected";
				this.orderStore.pushToMap(ord.originalID, newOrder);
				result.status = false;
        		result.msg = error;
        		return result;
			}

			newOrder.status = 'Replaced';
    		this.orderStore.pushToMap(newOrder.originalID, newOrder);
        	this.priceBoard.add(newOrder);

        	if(oldOrd.side == 'Buy') {
				this.account.hold(newOrder);
			} else {
				this.account.holdTrade(newOrder.account, newOrder.symbol, newOrder.qty);
			}
			result.status = true;
        	result.msg = oldOrd.orderID;
        } else {
        	var newOrder = Utils.clone(oldOrd);
        	newOrder.status = 'ORS Rejected';
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
        	error = "Order not found";
        	result.status = false;
        	result.msg = error;
        	return result;
		}
		if (this.sessionManager.getORSSession() == Session.ors.CLOSE) {
			error = "ORS session is close";
		}
		if (error == undefined) {
			var pendingCancel = Utils.clone(order);
    		pendingCancel.status = "Pending Cancel";
			this.orderStore.pushToMap(ord.originalID, pendingCancel);

			error = this.exchange.cancel(order);
        	if (error != undefined) {
				newOrder.status = "Rejected";
				this.orderStore.pushToMap(ord.originalID, order);
				result.status = false;
        		result.msg = error;
        		return result;
			}

			if(order.side == 'Buy') {
				this.account.unHold(order);
			} else {
				this.account.unHoldTrade(order.account, order.symbol, order.remain);
			}
			order.status = "Canceled";
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
			cancelOrder.status = "ORS Rejected";
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
		if (order == null) {
        	error = "Order not found";
		}
		if (this.exchange.getSession() == "CLOSE") {
			error = "Exchange is close";
		}
		if (error == undefined) {
			if(order.side == 'Buy') {
				this.account.unHold(order);
			} else {
				this.account.unHoldTrade(order.account, order.symbol, order.remain);
			}
			order.status = "Done For Day";
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
