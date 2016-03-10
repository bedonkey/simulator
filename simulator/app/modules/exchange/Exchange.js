Exchange = function(exchangeValidator, account, secinfo, orderStore, priceBoard, sessionManager) {
	this.exchangeValidator = exchangeValidator;
	this.account = account;
	this.secinfo = secinfo;
	this.orderStore = orderStore;
	this.priceBoard = priceBoard;
	this.sessionManager = sessionManager;
	this.matchOrdersBuy = this.orderStore.getAllOrderBuy();
	this.matchOrdersSell = this.orderStore.getAllOrderSell();
	this.matchATOOrders = this.orderStore.getAllATOOrder();
};

Exchange.prototype = {

	init: function() {
		this.matchOrdersSell.length = 0;
		this.matchOrdersBuy.length = 0;
		this.matchATOOrders.length = 0;
	},

	place: function(ord) {
		var ex = this.secinfo.getExchange(ord.symbol);
		var error = this.exchangeValidator.validateSecInfo(ord);
		if (error != undefined) {
			return {error: error};
		}
		if (this.sessionManager.getExchangeSession()[ex] == Session.CLOSE) {
			return {error: ErrorCode.EX_05};
		}
		if (this.sessionManager.getExchangeSession()[ex] == Session.NEW || this.sessionManager.getExchangeSession()[ex] == Session.INTERMISSION) {
			return {error: ErrorCode.EX_06};
		}
		if (ex == "HOSE" && this.sessionManager.getExchangeSession()[ex] == Session.ATO) {
			this.addATOOrderMatch(ord);
			this.priceBoard.add(ord.symbol, ord.side, ord.price, ord.qty);
			return {exec: "0"};
		} else {
			this.addOrderMatch(ord);
			this.priceBoard.add(ord.symbol, ord.side, ord.price, ord.qty);
			if (ord.status == "Pending New") {
				ord.status = OrdStatus.NEW;
				var isMatched = this.matching(ord);
	        	if (!isMatched) {
	        		this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
	        	}
			} else {
				var isMatched = this.matching(ord);
			}
			if (isMatched) {
				return {exec: "F"};
			}
			return {exec: "0"};
		}
	},

	replace: function(ord) {
		var ex = this.secinfo.getExchange(ord.symbol);
		var error = this.exchangeValidator.validateSecInfo(ord);
		if (error != undefined) {
			return {error: error};
		}
		if (this.sessionManager.getExchangeSession()[ex] == Session.CLOSE) {
			return {error: ErrorCode.EX_05};
		}
		if (this.sessionManager.getExchangeSession()[ex] == Session.NEW || this.sessionManager.getExchangeSession()[ex] == Session.INTERMISSION) {
			return {error: ErrorCode.EX_06};
		}
		if (ord.queue != undefined && ord.queue == "gateway") {
			if (ord.remain == 0) {
				var rejectOrder = Utils.clone(ord);
				rejectOrder.status = OrdStatus.REJECTED;
				rejectOrder.text = "Can not replace, order is Filled";
				this.orderStore.pushToMap(ord.originalID, rejectOrder);
				return {exec: "R"};
			}
			ord.status = ord.currentStatus;
		}
		var replaceOrd = Utils.clone(ord);
		replaceOrd.status = OrdStatus.REPLACED;
		this.orderStore.pushToMap(ord.originalID, replaceOrd);
		this.resort(ord);
		this.priceBoard.remove(ord.symbol, ord.side, ord.price - ord.underlyingPrice, ord.qty - ord.underlyingQty);
		this.priceBoard.add(ord.symbol, ord.side, ord.price, ord.qty);
		ord.underlyingPrice = 0;
		ord.underlyingQty = 0;
		var isMatched = this.matching(ord);
		if (isMatched) {
			return {exec: "F"};
		}
		return {exec: "0"};
	},

	cancel: function(ord) {
		var ex = this.secinfo.getExchange(ord.symbol);
		if (this.sessionManager.getExchangeSession()[ex] == Session.CLOSE) {
			return {error: ErrorCode.EX_05};
		}
		if (this.sessionManager.getExchangeSession()[ex] == Session.NEW || this.sessionManager.getExchangeSession()[ex] == Session.INTERMISSION) {
			return {error: ErrorCode.EX_06};
		}
		if (this.sessionManager.getExchangeSession()[ex] == Session.ATO) {
			this.orderStore.removeATOOrdersMatch(ord);
		}
		ord.status = OrdStatus.CANCELED;
		ord.remain = 0;
		ord.time = DateTime.getCurentDateTime();
		var cancelOrder = Utils.clone(ord);
		cancelOrder.orderID = IdGenerator.getId();
		this.orderStore.pushToMap(ord.originalID, cancelOrder);
		this.priceBoard.remove(ord.symbol, ord.side, ord.price, ord.qty);
		return {exec: "0"};
	},

	resort: function(ord) {
		if (ord.side == Side.SELL) {
			this.orderStore.removeOrderSellMatch(ord);
			this.orderStore.addOrderSellMatch(ord);
		} else {
			this.orderStore.removeOrderBuyMatch(ord);
			this.orderStore.addOrderBuyMatch(ord);
		}
	},

	addOrderMatch: function(ord) {
		if (ord.side == Side.SELL) {
			this.orderStore.addOrderSellMatch(ord);
		} else {
			this.orderStore.addOrderBuyMatch(ord);
		}
	},

	addATOOrderMatch: function(ord) {
		this.orderStore.addATOOrderMatch(ord);
	},

	matching: function(ord) {
		if (ord.side == Side.SELL) {
			return this.matchingSell(ord);
		} else {
			return this.matchingBuy(ord);
		}
	},

	matchingBuy: function(ord) {
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			if (ord.remain == 0) {
            	break;
            }
            if (this.matchOrdersSell[i].remain > 0 && this.matchOrdersSell[i].symbol == ord.symbol && this.matchOrdersSell[i].account != ord.account) {
        		if (ord.price >= this.matchOrdersSell[i].price) {
        			this.match(ord, this.matchOrdersSell[i], this.matchOrdersSell[i].price);
        			return true;
        		}
            }
        }
        return false;
	},

	matchingSell: function(ord) {
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			if (ord.remain == 0) {
            	break;
            }
            if (this.matchOrdersBuy[i].remain > 0 && this.matchOrdersBuy[i].symbol == ord.symbol && this.matchOrdersBuy[i].account != ord.account) {
        		if (ord.price <= this.matchOrdersBuy[i].price) {
        			this.match(ord, this.matchOrdersBuy[i], this.matchOrdersBuy[i].price);
        			return true;
        		}
            }
        }
        return false;
	},

	match: function(ord1, ord2, matchPx) {
		var orgOrderMatch = Utils.clone(ord1);
    	var matchQty;
    	var remainOrd1 = ord1.remain - ord1.underlyingQty;
    	var remainOrd2 = ord2.remain - ord2.underlyingQty;
    	if (remainOrd2 == remainOrd1) {
    		matchQty = remainOrd1;
	    	ord1.status = OrdStatus.FILLED;
        	ord2.status = OrdStatus.FILLED;
        	ord1.remain = 0;
        	ord2.remain = 0;
    	} else if (remainOrd2 > remainOrd1) {
    		matchQty = remainOrd1;
    		ord1.status = OrdStatus.FILLED;
        	ord2.status = OrdStatus.PARTIAL_FILLED;
        	ord2.remain = remainOrd2 - remainOrd1;
        	ord1.remain = 0;
    	} else if (remainOrd2 < remainOrd1) {
    		matchQty = ord2.remain;
    		ord1.status = OrdStatus.PARTIAL_FILLED;
        	ord2.status = OrdStatus.FILLED;
        	ord1.remain = remainOrd1 - remainOrd2;
        	ord2.remain = 0;
    	}
    	ord1.avgQty += parseInt(matchQty);
    	ord1.avgPX = matchPx;
    	ord2.avgQty += parseInt(matchQty);
    	ord2.avgPX = matchPx;
    	if (ord1.side == Side.SELL) {
    		this.account.unHoldT0(ord1.account, ord1.symbol, matchPx * matchQty);
    		this.account.unHoldTradeT0(ord2.account, ord2.symbol, matchQty);
    	} else {
    		this.account.unHoldTradeT0(ord1.account, ord1.symbol, matchQty);
    		this.account.unHoldT0(ord2.account, ord2.symbol, matchPx * matchQty);
    	}
    	var matchOrd1 = Utils.clone(ord1);
    	var matchOrd2 = Utils.clone(ord2);
    	matchOrd1.time = DateTime.getCurentDateTime();
    	matchOrd2.time = DateTime.getCurentDateTime();

        this.orderStore.pushToMap(ord2.originalID, matchOrd2);
        if (orgOrderMatch.status != undefined) {
        	this.orderStore.pushToMap(ord1.originalID, matchOrd1);
        } else {
        	orgOrderMatch.status = OrdStatus.NEW;
        	this.orderStore.pushToMap(ord1.originalID, orgOrderMatch);
        }
        this.priceBoard.addMatch(ord1.symbol, matchPx, matchQty);
        this.priceBoard.subtract(ord1.symbol, ord1.side, ord1.price, matchQty);
        this.priceBoard.subtract(ord2.symbol, ord2.side, ord2.price, matchQty);
	},

	expiredOrders: function() {
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			this.expired(this.matchOrdersBuy[i]);
			this.matchOrdersBuy.splice(i, 1);
		}
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			this.expired(this.matchOrdersSell[i]);
			this.matchOrdersSell.splice(i, 1);
		}
	},

	matchATO: function() {
		console.log("Match ATO orders");
		for (var i = this.matchATOOrders.length -1; i >= 0; i--) {
			this.expired(this.matchATOOrders[i]);
			this.matchATOOrders.splice(i, 1);
		}
	},

	expired: function(ord) {
		ord.status = OrdStatus.EXPIRED;
		if (ord.side == Side.SELL) {
    		this.account.unHoldTrade(ord.account, ord.symbol, ord.remain);
    	} else {
    		this.account.unHold(ord);
    	}
    	this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
	},

	setSession: function(ex, session) {
		if (ex == "HOSE" && session == Session.OPEN1 && this.sessionManager.getExchangeSession()[ex] == Session.ATO) {
			this.matchATO();
		}
		this.sessionManager.setExchangeSession(ex, session);
		
	},

	getSession: function(ex) {
		return this.sessionManager.getExchangeSession(ex);
	}
}	
