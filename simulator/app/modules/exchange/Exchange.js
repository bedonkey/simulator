Exchange = function(exchangeValidator, account, secinfo, orderStore, priceBoard, sessionManager) {
	this.exchangeValidator = exchangeValidator;
	this.account = account;
	this.secinfo = secinfo;
	this.orderStore = orderStore;
	this.priceBoard = priceBoard;
	this.sessionManager = sessionManager;
	this.matchOrdersBuy = this.orderStore.getAllOrderBuy();
	this.matchOrdersSell = this.orderStore.getAllOrderSell();
};

Exchange.prototype = {

	init: function() {
		this.matchOrdersSell.length = 0;
		this.matchOrdersBuy.length = 0;
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
			this.addOrderMatch(ord);
			this.priceBoard.add(ord.symbol, ord.side, ord.price, ord.qty);
			return {exec: "0"};
		} else {
			this.addOrderMatch(ord);
			console.log('Add order: ')
			console.log(ord)
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
			this.orderStore.addOrderSellMatch(ord);
		} else {
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

	matching: function(ord) {
		if (ord.side == Side.SELL) {
			return this.matchingSell(ord);
		} else {
			return this.matchingBuy(ord);
		}
	},

	matchingBuy: function(ord) {
		var isMatch = false;
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			if (ord.remain == 0) {
            	break;
            }
            if (this.matchOrdersSell[i].remain > 0 && this.matchOrdersSell[i].symbol == ord.symbol && this.matchOrdersSell[i].account != ord.account) {
        		if (ord.price >= this.matchOrdersSell[i].price) {
        			this.match(Side.BUY, ord, this.matchOrdersSell[i], this.matchOrdersSell[i].price);
        			isMatch = true;
        		}
            }
        }
        return isMatch;
	},

	matchingSell: function(ord) {
		var isMatch = false;
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			if (ord.remain == 0) {
            	break;
            }
            if (this.matchOrdersBuy[i].remain > 0 && this.matchOrdersBuy[i].symbol == ord.symbol && this.matchOrdersBuy[i].account != ord.account) {
        		if (ord.price <= this.matchOrdersBuy[i].price) {
        			this.match(Side.SELL, this.matchOrdersBuy[i], ord, this.matchOrdersBuy[i].price);
        			isMatch = true;
        		}
            }
        }
        return isMatch;
	},

	match: function(side, ordBuy, ordSell, matchPx) {
		ordBuy.time = DateTime.getCurentDateTime();
		ordBuy.statusBeforeMatch = ordBuy.status;
    	ordSell.time = DateTime.getCurentDateTime();
		ordSell.statusBeforeMatch = ordSell.status;
    	var matchQty = this.calcMatchQty(ordBuy, ordSell);
    	this.pushToStore(side, Utils.clone(ordBuy), Utils.clone(ordSell));
    	ordBuy.avgQty += parseInt(matchQty);
    	ordBuy.avgPX = matchPx;
    	ordSell.avgQty += parseInt(matchQty);
    	ordSell.avgPX = matchPx;
    	
    	if (ordBuy.side == Side.SELL) {
    		this.account.unHoldT0(ordBuy.account, ordBuy.symbol, matchPx * matchQty);
    		this.account.unHoldTradeT0(ordSell.account, ordSell.symbol, matchQty);
    	} else {
    		this.account.unHoldTradeT0(ordBuy.account, ordBuy.symbol, matchQty);
    		this.account.unHoldT0(ordSell.account, ordSell.symbol, matchPx * matchQty);
    	}
        this.priceBoard.addMatch(ordBuy.symbol, matchPx, matchQty);
        this.priceBoard.subtract(ordBuy.symbol, ordBuy.side, ordBuy.price, matchQty);
        this.priceBoard.subtract(ordSell.symbol, ordSell.side, ordSell.price, matchQty);
	},

	calcMatchQty: function(ordBuy, ordSell) {
		var matchQty;
		var remainBuy = ordBuy.remain - ordBuy.underlyingQty;
    	var remainSell = ordSell.remain - ordSell.underlyingQty;
    	if (remainSell == remainBuy) {
    		matchQty = remainBuy;
	    	ordBuy.status = OrdStatus.FILLED;
        	ordSell.status = OrdStatus.FILLED;
        	ordBuy.remain = 0;
        	ordSell.remain = 0;
    	} else if (remainSell > remainBuy) {
    		matchQty = remainBuy;
    		ordBuy.status = OrdStatus.FILLED;
        	ordSell.status = OrdStatus.PARTIAL_FILLED;
        	ordSell.remain = remainSell - remainBuy;
        	ordBuy.remain = 0;
    	} else if (remainSell < remainBuy) {
    		matchQty = ordSell.remain;
    		ordBuy.status = OrdStatus.PARTIAL_FILLED;
        	ordSell.status = OrdStatus.FILLED;
        	ordBuy.remain = remainBuy - remainSell;
        	ordSell.remain = 0;
    	}
    	return matchQty;
	},

	pushToStore: function(side, ordBuy, ordSell) {
    	if (side == Side.BUY) {
    		this.orderStore.pushToMap(ordSell.originalID, ordSell);
    		this.pushOther(ordBuy);
    	} else {
    		this.orderStore.pushToMap(ordBuy.originalID, ordBuy);
    		this.pushOther(ordSell);
    	}
 
	},

	pushOther: function(ord) {
		if (ord.statusBeforeMatch != undefined) {
    		if (ord.statusBeforeMatch == OrdStatus.PARTIAL_FILLED) {
    			var partilaFilledOrder = Utils.clone(ord);
		 		partilaFilledOrder.status = OrdStatus.PARTIAL_FILLED;
		 		this.orderStore.pushToMap(ord.originalID, partilaFilledOrder);
    		} else {
    			this.orderStore.pushToMap(ord.originalID, ord);
    		}
    	} else {
    		var newOrder = Utils.clone(ord);
		 	newOrder.status = OrdStatus.NEW;
         	this.orderStore.pushToMap(ord.originalID, newOrder);
    	}
	},

	expiredOrders: function(ex) {
		for (var i = this.matchOrdersBuy.length -1; i >= 0; i--) {
			if (ex == this.matchOrdersBuy[i].ex) {
				this.expired(this.matchOrdersBuy[i]);
				this.matchOrdersBuy.splice(i, 1);
			}
		}
		for (var i = this.matchOrdersSell.length -1; i >= 0; i--) {
			if (ex == this.matchOrdersSell[i].ex) {
				this.expired(this.matchOrdersSell[i]);
				this.matchOrdersSell.splice(i, 1);
			}
		}
	},

	matchATO: function() {
		console.log("Match ATO orders");
		var matchPx = this.findBestMatchPrice();
		console.log("Best Price Match ATO session: " + matchPx);
		console.log(this.matchOrdersBuy)
		console.log(this.matchOrdersSell)
		if (matchPx > 0) {
			for (var i = this.matchOrdersBuy.length -1; i >= 0 ; i--) {
				if (this.matchOrdersBuy[i].remain == 0) {
					continue;
				}
				for (var j = 0; j < this.matchOrdersSell.length; j++) {
					if (this.matchOrdersSell[j].remain > 0&& this.matchOrdersBuy[i].symbol == this.matchOrdersSell[j].symbol && this.matchOrdersBuy[i].account != this.matchOrdersSell[j].account) {
						this.match(Side.BUY, this.matchOrdersBuy[i], this.matchOrdersSell[j], matchPx);
					}
				}
			}
		}
		this.expireAllATOOrders();
	},

	findBestMatchPrice: function() {
		var listPrice = [];
		for (var i = this.matchOrdersBuy.length -1; i >= 0; i--) {
			if (this.matchOrdersBuy[i].price > 0) {
				listPrice.push(this.matchOrdersBuy[i].price);
			}
		}
		for (var i = this.matchOrdersSell.length -1; i >= 0; i--) {
			if (this.matchOrdersSell[i].price > 0) {
				listPrice.push(this.matchOrdersBuy[i].price);
			}
		}
		return listPrice[0];
	},

	expireAllATOOrders: function() {
		for (var i = this.matchOrdersBuy.length -1; i >= 0; i--) {
			if (this.matchOrdersBuy[i].type == Session.ATO && this.matchOrdersBuy[i].remain != 0) {
				this.expired(this.matchOrdersBuy[i]);
				this.matchOrdersBuy.splice(i, 1);
			}
		}
		for (var i = this.matchOrdersSell.length -1; i >= 0; i--) {
			if (this.matchOrdersSell[i].type == Session.ATO && this.matchOrdersSell[i].remain != 0) {
				this.expired(this.matchOrdersSell[i]);
				this.matchOrdersSell.splice(i, 1);
			}
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
		if (session == Session.CLOSE) {
			this.expiredOrders(ex);
		}
		var currentSession = this.sessionManager.getExchangeSession()[ex];
		this.sessionManager.setExchangeSession(ex, session);
		if (ex == "HOSE" && session == Session.OPEN1 && currentSession == Session.ATO) {
			this.matchATO();
		}
	},

	getSession: function(ex) {
		return this.sessionManager.getExchangeSession(ex);
	}
}	
