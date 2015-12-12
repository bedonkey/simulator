Order = function(orderValidator, afType, orderStore, matcher, account, priceBoard, exchange) {
	this.orderValidator = orderValidator;
	this.orderStore = orderStore;
	this.account = account;
	this.priceBoard = priceBoard;
	this.matcher = matcher;
	this.afType = afType;
	this.exchange = exchange;
};

Order.prototype = {

	place: function(ord) {
		var result = {};
		var error = this.orderValidator.clientValidate(ord);
		if (this.exchange.getSession() == "CLOSE") {
			error = "Exchange is close";
		}
		if (error == undefined) {
			error = this.orderValidator.validatePlace(ord);
		}
		if (error == undefined) {
			ord.status = "New";
	    	ord.orderID = IdGenerator.getId();
	    	ord.originalID = ord.orderID;
	    	ord.time = DateTime.getCurentDateTime();
	    	ord.avgQty = 0;
	    	ord.avgPX = 0;
	    	ord.remain = ord.qty;
	    	var acc = this.account.getByID(ord.account);
	    	ord.priceMargin = this.afType.getPriceMargin(acc.afType, ord.symbol);

	    	var newOrder = Utils.clone(ord);
	        this.orderStore.add(newOrder);
	        this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
			if(ord.side == 'Buy') {
				this.account.hold(ord);
			} else {
				this.account.holdTrade(ord.account, ord.symbol, ord.qty);
			}
			this.priceBoard.add(newOrder);
			this.matcher.addOrderMatch(newOrder);
            this.matcher.matching(newOrder);
        }
        if (error == undefined) {
        	result.status = true;
        	result.msg = ord.orderID;
        } else {
        	result.status = false;
        	result.msg = error;
        }
        return result;
	},

	replace: function(ord) {
		var result = {};
		var oldOrd = this.orderStore.getNewOrder(ord.orderID);
		if (oldOrd != null) {
			error = this.orderValidator.validateReplace(oldOrd, ord);
		} else {
			error = "Order not found";
		}
		if (this.exchange.getSession() == "CLOSE") {
			error = "Exchange is close";
		}
		if (error == undefined) {
			if (ord.qty <= oldOrd.avgQty) {
				error = "Not Enough qty";
			} else {
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
				newOrder.status = 'Replaced';
	    		this.orderStore.pushToMap(newOrder.originalID, newOrder);
	        	this.priceBoard.add(newOrder);
	        	this.matcher.resort(oldOrd);
	        	this.matcher.matching(oldOrd);

	        	if(oldOrd.side == 'Buy') {
					this.account.hold(newOrder);
				} else {
					this.account.holdTrade(newOrder.account, newOrder.symbol, newOrder.qty);
				}
				result.status = true;
	        	result.msg = oldOrd.orderID;
			}
        } else {
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
        	result.status = false;
        	result.msg = error;
		}
		return result;
	},

}	
