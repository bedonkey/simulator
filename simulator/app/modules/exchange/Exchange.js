Exchange = function(account, orderStore, priceBoard, dockService) {
	this.account = account;
	this.orderStore = orderStore;
	this.priceBoard = priceBoard;
	this.matchOrdersSell = [];
	this.matchOrdersBuy = [];
	this.session = Session.INIT;
	this.dockService = dockService;
};

Exchange.prototype = {

	init: function() {
		this.matchOrdersSell.length = 0;
		this.matchOrdersBuy.length = 0;
	},

	getAllOrderBuy: function() {
		return this.matchOrdersBuy;
	},

	getAllOrderSell: function() {
		return this.matchOrdersSell;
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
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			if (ord.price > this.matchOrdersBuy[i].price) {
				this.matchOrdersBuy.splice(i, 0, ord);
				return;
			}
		}
		this.matchOrdersBuy.push(ord);
	},

	addOrderSellMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			if (ord.price < this.matchOrdersSell[i].price) {
				this.matchOrdersSell.splice(i, 0, ord);
				return;
			}
		}
		this.matchOrdersSell.push(ord);
	},

	removeOrderBuyMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			if (ord.orderID == this.matchOrdersBuy[i].orderID) {
				this.matchOrdersBuy.splice(i, 1);
				return;
			}
		}
	},

	removeOrderSellMatch: function(ord) {
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			if (ord.orderID == this.matchOrdersSell[i].orderID) {
				this.matchOrdersSell.splice(i, 1);
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
		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			if (ord.remain == 0) {
            	break;
            }
            if (this.matchOrdersSell[i].remain > 0 && this.matchOrdersSell[i].symbol == ord.symbol && this.matchOrdersSell[i].account != ord.account) {
        		if (ord.price >= this.matchOrdersSell[i].price) {
        			this.match(ord, this.matchOrdersSell[i], ord.price);
        		}
            }
        }
	},

	matchingSell: function(ord) {
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			if (ord.remain == 0) {
            	break;
            }
            if (this.matchOrdersBuy[i].remain > 0 && this.matchOrdersBuy[i].symbol == ord.symbol && this.matchOrdersBuy[i].account != ord.account) {
        		if (ord.price <= this.matchOrdersBuy[i].price) {
        			this.match(ord, this.matchOrdersBuy[i], this.matchOrdersBuy[i].price);
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
		for (var i = 0; i < this.matchOrdersBuy.length; i++) {
			this.expired(this.matchOrdersBuy[i]);
			this.matchOrdersBuy.splice(i, 1);
		}

		for (var i = 0; i < this.matchOrdersSell.length; i++) {
			this.expired(this.matchOrdersSell[i]);
			this.matchOrdersSell.splice(i, 1);
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
		return this.session;
	},

	close: function() {
		this.session = Session.CLOSE;
		this.dockService.setSession(Session.CLOSE);
	},

	open: function() {
		this.session = Session.OPEN;
		this.dockService.setSession(Session.OPEN);
	}

}	
