Exchange = function(account, orderStore, priceBoard, dockService) {
	this.account = account;
	this.orderStore = orderStore;
	this.priceBoard = priceBoard;
	matchOrdersSell = [];
	matchOrdersBuy = [];
	session = 'CLOSE';
	this.dockService = dockService;
};

Exchange.prototype = {

	init: function() {
		matchOrdersSell.length = 0;
		matchOrdersBuy.length = 0;
	},

	getAllOrderBuy: function() {
		return matchOrdersBuy;
	},

	getAllOrderSell: function() {
		return matchOrdersSell;
	},

	resort: function(ord) {
		if (ord.side == 'Sell') {
			this.removeOrderSellMatch(ord);
			this.addOrderSellMatch(ord);
		} else {
			this.removeOrderBuyMatch(ord);
			this.addOrderBuyMatch(ord);
		}
	},

	addOrderMatch: function(ord) {
		if (ord.side == 'Sell') {
			this.addOrderSellMatch(ord);
		} else {
			this.addOrderBuyMatch(ord);
		}
	},

	addOrderBuyMatch: function(ord) {
		for (var i = 0; i < matchOrdersBuy.length; i++) {
			if (ord.price > matchOrdersBuy[i].price) {
				matchOrdersBuy.splice(i, 0, ord);
				return;
			}
		}
		matchOrdersBuy.push(ord);
	},

	addOrderSellMatch: function(ord) {
		for (var i = 0; i < matchOrdersSell.length; i++) {
			if (ord.price < matchOrdersSell[i].price) {
				matchOrdersSell.splice(i, 0, ord);
				return;
			}
		}
		matchOrdersSell.push(ord);
	},

	removeOrderBuyMatch: function(ord) {
		for (var i = 0; i < matchOrdersBuy.length; i++) {
			if (ord.orderID == matchOrdersBuy[i].orderID) {
				matchOrdersBuy.splice(i, 1);
				return;
			}
		}
	},

	removeOrderSellMatch: function(ord) {
		for (var i = 0; i < matchOrdersSell.length; i++) {
			if (ord.orderID == matchOrdersSell[i].orderID) {
				matchOrdersSell.splice(i, 1);
				return;
			}
		}
	},

	matching: function(ord) {
		if (ord.side == 'Sell') {
			this.matchingSell(ord);
		} else {
			this.matchingBuy(ord);
		}
	},

	matchingBuy: function(ord) {
		for (var i = 0; i < matchOrdersSell.length; i++) {
			if (ord.remain == 0) {
            	break;
            }
            if (matchOrdersSell[i].remain > 0 && matchOrdersSell[i].symbol == ord.symbol && matchOrdersSell[i].account != ord.account) {
        		if (ord.price >= matchOrdersSell[i].price) {
        			this.match(ord, matchOrdersSell[i], ord.price);
        		}
            }
        }
	},

	matchingSell: function(ord) {
		for (var i = 0; i < matchOrdersBuy.length; i++) {
			if (ord.remain == 0) {
            	break;
            }
            if (matchOrdersBuy[i].remain > 0 && matchOrdersBuy[i].symbol == ord.symbol && matchOrdersBuy[i].account != ord.account) {
        		if (ord.price <= matchOrdersBuy[i].price) {
        			this.match(ord, matchOrdersBuy[i], matchOrdersBuy[i].price);
        		}
            }
        }
	},

	match: function(ord1, ord2, matchPx) {
    	var matchQty;
    	if (ord2.remain == ord1.remain) {
    		matchQty = ord1.remain;
	    	ord1.status = 'Filled';
        	ord2.status = 'Filled';
        	ord1.remain = 0;
        	ord2.remain = 0;
    	} else if (ord2.remain > ord1.remain) {
    		matchQty = ord1.remain;
    		ord1.status = 'Filled';
        	ord2.status = 'Partial Filled';
        	ord2.remain = ord2.remain - ord1.remain;
        	ord1.remain = 0;
    	} else if (ord2.remain < ord1.remain) {
    		matchQty = ord2.remain;
    		ord1.status = 'Partial Filled';
        	ord2.status = 'Filled';
        	ord1.remain = ord1.remain - ord2.remain;
        	ord2.remain = 0;
    	}
    	ord1.avgQty += parseInt(matchQty);
    	ord1.avgPX = matchPx;
    	ord2.avgQty += parseInt(matchQty);
    	ord2.avgPX = matchPx;
    	if (ord1.side == 'Sell') {
    		this.account.unHoldT0(ord1.account, ord1.symbol, matchPx * matchQty);
    		this.account.unHoldTradeT0(ord2.account, ord2.symbol, matchQty);
    	} else {
    		this.account.unHoldTradeT0(ord1.account, ord1.symbol, matchQty);
    		this.account.unHoldT0(ord2.account, ord2.symbol, matchPx * matchQty);
    	}
        this.orderStore.pushToMap(ord2.originalID, Utils.clone(ord2));
        this.orderStore.pushToMap(ord1.originalID, Utils.clone(ord1));
        this.priceBoard.addMatch(ord1.symbol, matchPx, matchQty);
        this.priceBoard.subtract(ord1.symbol, ord1.side, ord1.price, matchQty);
        this.priceBoard.subtract(ord2.symbol, ord2.side, ord2.price, matchQty);
	},

	expiredOrders: function() {
		for (var i = 0; i < matchOrdersBuy.length; i++) {
			this.expired(matchOrdersBuy[i]);
			matchOrdersBuy.splice(i, 1);
		}

		for (var i = 0; i < matchOrdersSell.length; i++) {
			this.expired(matchOrdersSell[i]);
			matchOrdersSell.splice(i, 1);
		}
	},

	expired: function(ord) {
		ord.status = 'Expired';
		if (ord.side == 'Sell') {
    		this.account.unHoldTrade(ord.account, ord.symbol, ord.remain);
    	} else {
    		this.account.unHold(ord);
    	}
    	this.orderStore.pushToMap(ord.originalID, Utils.clone(ord));
	},

	getSession: function() {
		return session;
	},

	close: function() {
		session = 'CLOSE';
		this.dockService.setSession('CLOSE');

	},

	open: function() {
		session = 'OPEN';
		this.dockService.setSession('OPEN');
	}

}	
