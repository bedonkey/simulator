Exchange = function(broadcastService, exchangeValidator, account, secinfo, orderStore, priceBoard, sessionManager) {
	this.exchangeValidator = exchangeValidator;
	this.account = account;
	this.secinfo = secinfo;
	this.orderStore = orderStore;
	this.priceBoard = priceBoard;
	this.sessionManager = sessionManager;
	this.matchOrdersBuy = this.orderStore.getAllOrderBuy();
	this.matchOrdersSell = this.orderStore.getAllOrderSell();
	this.broadcastService = broadcastService;
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
		} else if (this.sessionManager.getExchangeSession()[ex] == Session.ATC) {
			this.addOrderMatch(ord);
			this.priceBoard.add(ord.symbol, ord.side, ord.price, ord.qty);
			if (ord.status == "Pending New") {
				ord.status = OrdStatus.NEW;
				this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
			}
			return {exec: "0"};
		} else {
			this.addOrderMatch(ord);
			this.priceBoard.add(ord.symbol, ord.side, ord.price, ord.qty);
			if (ord.status == OrdStatus.PENDING_NEW) {
				ord.status = OrdStatus.NEW;
				var isMatched = this.matching(ord);
	        	if (!isMatched) {
	        		this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
	        	}
			} else {
				var isMatched = this.matching(ord);
				if (!isMatched) {
	        		if (ord.type == OrdType.MP) {
	        			this.expired(ord);
	        		}
	        		if (ord.type == OrdType.MTL) {
	        			this.expired(ord);
	        		}
	        		if (ord.type == OrdType.MOK) {
	        			this.expired(ord);
	        		}
	        		if (ord.type == OrdType.MAK) {
	        			this.expired(ord);
	        		}
	        	} else {
	        		if (ord.remain > 0 && (ord.type == OrdType.MAK || ord.type == OrdType.MOK)) {
	        			this.expired(ord);
	        			this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
	        		}
	        		if (ord.remain > 0 && (ord.type == OrdType.MP || ord.type == OrdType.MTL)) {
	        			ord.status = OrdStatus.NEW;
	        			ord.price = ord.avgPX;
	        			ord.orderID = IdGenerator.getId();
	        			var newLO = Utils.clone(ord);
	        			newLO.status = OrdStatus.NEW_LO;
	        			this.orderStore.pushToMap(ord.originalID, newLO);
	        			this.account.unHoldWidthPriceAndQty(ord.account, ord.holdPrice - ord.price, ord.remain);
	        		}
	        	}
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
		if (this.sessionManager.getExchangeSession()[ex] == Session.ATC) {
			return {error: ErrorCode.EX_07};
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
        		if (ord.price == 0 || ord.price >= this.matchOrdersSell[i].price) {
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
    	var matchQty = this.calcMatchQty(side, ordBuy, ordSell);
    	if (matchQty == 0 || matchQty == undefined) {
    		return;
    	}
    	ordBuy.avgQty += parseInt(matchQty);
    	ordBuy.avgPX = matchPx;
    	ordSell.avgQty += parseInt(matchQty);
    	ordSell.avgPX = matchPx;
    	this.pushToStore(side, Utils.clone(ordBuy), Utils.clone(ordSell));
    	
    	if (ordBuy.side == Side.SELL) {
    		this.account.unHoldT0(ordBuy.account, ordBuy.symbol, matchPx * matchQty);
    		this.account.unHoldTradeT0(ordSell.account, ordSell.symbol, matchQty);
    	} else {
    		this.account.unHoldTradeT0(ordBuy.account, ordBuy.symbol, matchQty);
    		this.account.unHoldT0(ordSell.account, ordSell.symbol, matchPx * matchQty);
    		
    	}
    	if (ordBuy.price == 0) {
    		this.account.unHoldWidthPriceAndQty(ordBuy.account, ordBuy.holdPrice - matchPx, matchQty);
    	}
        this.priceBoard.addMatch(ordBuy.symbol, matchPx, matchQty);
        this.priceBoard.subtract(ordBuy.symbol, ordBuy.side, ordBuy.price, matchQty);
        this.priceBoard.subtract(ordSell.symbol, ordSell.side, ordSell.price, matchQty);
	},

	calcMatchQty: function(side, ordBuy, ordSell) {
		var matchQty;
		
		var remainBuy = ordBuy.remain - ordBuy.underlyingQty;
    	var remainSell = ordSell.remain - ordSell.underlyingQty;
    	if (remainSell == remainBuy) {
    		matchQty = remainBuy;
	    	ordBuy.status = OrdStatus.FILLED;
        	ordSell.status = OrdStatus.FILLED;
        	ordBuy.remain = 0;
        	ordSell.remain = 0;
    	} else if ((side == Side.SELL && ordSell.type == OrdType.MOK) || (side == Side.BUY && ordBuy.type == OrdType.MOK)) {
    		return 0;
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
    			if (ord.remain == 0) {
    				partilaFilledOrder.status = OrdStatus.FILLED;
    			} else {
    				partilaFilledOrder.status = OrdStatus.PARTIAL_FILLED;
    			}
		 		partilaFilledOrder.remain = ord.remain;
		 		partilaFilledOrder.avgQty = ord.avgQty;
		 		this.orderStore.pushToMap(ord.originalID, partilaFilledOrder);
    		} else {
    			this.orderStore.pushToMap(ord.originalID, ord);
    		}
    	} else {
    		var newOrder = Utils.clone(ord);
		 	newOrder.status = OrdStatus.NEW;
		 	newOrder.remain = ord.qty;
		 	newOrder.avgQty = 0;
         	this.orderStore.pushToMap(ord.originalID, newOrder);
         	if (ord.remain == 0) {
         		var filledOrder = Utils.clone(ord);
         		filledOrder.remain = ord.remain;
		 		filledOrder.avgQty = ord.avgQty;
		 		filledOrder.status = OrdStatus.FILLED;
		 		this.orderStore.pushToMap(ord.originalID, filledOrder);
         	} else {
         		var partilaFilledOrder = Utils.clone(ord);
         		partilaFilledOrder.remain = ord.remain;
		 		partilaFilledOrder.avgQty = ord.avgQty;
		 		partilaFilledOrder.status = OrdStatus.PARTIAL_FILLED;
		 		this.orderStore.pushToMap(ord.originalID, partilaFilledOrder);
         	}
    	}
	},

	expireOrders: function(ex) {
		console.log("Expire all orders");
		for (var i = this.matchOrdersBuy.length -1; i >= 0; i--) {
			if (ex == this.matchOrdersBuy[i].ex && this.matchOrdersBuy[i].remain > 0) {
				this.expired(this.matchOrdersBuy[i]);
				this.matchOrdersBuy.splice(i, 1);
			}
		}
		for (var i = this.matchOrdersSell.length -1; i >= 0; i--) {
			if (ex == this.matchOrdersSell[i].ex && this.matchOrdersSell[i].remain > 0) {
				this.expired(this.matchOrdersSell[i]);
				this.matchOrdersSell.splice(i, 1);
			}
		}
	},

	matchATO: function() {
		var matchPx = this.findBestMatchPrice();
		if (matchPx > 0) {
			for (var i = this.matchOrdersBuy.length -1; i >= 0 ; i--) {
				for (var j = 0; j < this.matchOrdersSell.length; j++) {
					if (this.matchOrdersSell[j].remain > 0 && this.matchOrdersBuy[i].symbol == this.matchOrdersSell[j].symbol && this.matchOrdersBuy[i].account != this.matchOrdersSell[j].account) {
						if (this.matchOrdersBuy[i].remain == 0) {
							continue;
						}
						this.match(Side.BUY, this.matchOrdersBuy[i], this.matchOrdersSell[j], matchPx);
					}
				}
			}
		}
		this.expireAllATOOrders();
	},

	matchATC: function(ex) {
		var matchPx = this.findBestMatchPrice();
		if (matchPx > 0) {
			for (var i = this.matchOrdersBuy.length -1; i >= 0 ; i--) {
				for (var j = 0; j < this.matchOrdersSell.length; j++) {
					if (this.matchOrdersSell[j].remain > 0 && this.matchOrdersBuy[i].symbol == this.matchOrdersSell[j].symbol && this.matchOrdersBuy[i].account != this.matchOrdersSell[j].account) {
						if (this.matchOrdersBuy[i].remain == 0) {
							continue;
						}
						this.match(Side.BUY, this.matchOrdersBuy[i], this.matchOrdersSell[j], matchPx);
					}
				}
			}
		}
		this.expireOrders();
	},

	calcMatchQtyForATO: function(ordBuy, ordSell) {
		var remainBuy = ordBuy.remain - ordBuy.underlyingQty;
    	var remainSell = ordSell.remain - ordSell.underlyingQty;
    	if (remainSell => remainBuy) {
    		return remainBuy;
    	} else if (remainSell < remainBuy) {
    		return remainSell;
    	}
	},

	calcTotalMatchQtyWithPrice: function(price) {
		var totalMatchQty = 0;
		for (var i = this.matchOrdersBuy.length -1; i >= 0 ; i--) {
			if (this.matchOrdersBuy[i].remain == 0) {
				continue;
			}
			for (var j = 0; j < this.matchOrdersSell.length; j++) {
				if (this.matchOrdersSell[j].remain > 0&& this.matchOrdersBuy[i].symbol == this.matchOrdersSell[j].symbol && this.matchOrdersBuy[i].account != this.matchOrdersSell[j].account) {
					totalMatchQty += this.calcMatchQtyForATO(this.matchOrdersBuy[i], this.matchOrdersSell[j], price);
				}
			}
		}
		return totalMatchQty;
	},

	findBestMatchPrice: function() {
		var listPrice = [];
		var listQty = [];
		for (var i = this.matchOrdersBuy.length -1; i >= 0; i--) {
			if (this.matchOrdersBuy[i].price > 0 && listPrice.indexOf(this.matchOrdersBuy[i].price) == -1) {
				listPrice.push(this.matchOrdersBuy[i].price);
			}
		}
		for (var i = this.matchOrdersSell.length -1; i >= 0; i--) {
			if (this.matchOrdersSell[i].price > 0 && listPrice.indexOf(this.matchOrdersSell[i].price) == -1) {
				listPrice.push(this.matchOrdersSell[i].price);
			}
		}
		for (var i = listPrice.length - 1; i >= 0; i--) {
			listQty[i] = this.calcTotalMatchQtyWithPrice(listPrice[i]);
		}
		var x = 0;
		var qty = 0;
		for (var i = listQty.length - 1; i >= 0; i--) {
			if(listQty[i] > qty) {
				qty = listQty[i];
				x = i;
			}
		};
		return listPrice[x];
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
    	ord.remain = 0;
    	if (ord.price != 0 || ord.type == OrdType.ATO || ord.type == OrdType.ATC) {
    		this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
    	}
	},

	setSession: function(ex, session) {
		
		var currentSession = this.sessionManager.getExchangeSession()[ex];
		this.sessionManager.setExchangeSession(ex, session);
		if (ex == "HOSE" && session == Session.OPEN1 && currentSession == Session.ATO) {
			this.matchATO();
		}

		if (session == Session.PT) {
			if (currentSession == Session.ATC) {
				this.matchATC(ex);
			}
			this.expireOrders(ex);
		}
	},

	getSession: function(ex) {
		return this.sessionManager.getExchangeSession(ex);
	}
}	
