OrderValidator = function(account, secinfo, afType, sessionManager) {
  this.account = account;
  this.secinfo = secinfo;
  this.afType = afType;
  this.sessionManager = sessionManager;
};

OrderValidator.prototype = {
	clientValidate: function(ord) {
		if (ord.account == '') return ErrorCode.ORS_05;
        if (ord.symbol == '') return ErrorCode.ORS_06;
        if (ord.price == '') return ErrorCode.ORS_07;
        if (isNaN(ord.price)) return ErrorCode.ORS_08;
        if (ord.qty == '') return ErrorCode.ORS_09;
        if (isNaN(ord.qty)) return ErrorCode.ORS_10;
        if (ord.qty <= 0) return ErrorCode.ORS_11;
	},

	validatePlace: function(ord) {
        var ex = "HNX"
        var accs = this.account.get(ord.account);
        if (accs.length == 0) return ErrorCode.ORS_12;
        var secs = this.secinfo.get(ord.symbol);
        if (secs.length == 0) return ErrorCode.ORS_13;
        if (ord.price < secs[0].floor) return ErrorCode.ORS_17;
        if (ord.price > secs[0].ceil) return ErrorCode.ORS_18;
        if (secs[0].status == 'H') return ErrorCode.ORS_16;
        if (ord.side == Side.BUY) {
            var priceMargin = this.afType.getPriceMargin(accs[0].afType, ord.symbol);
            if ((ord.price - priceMargin) * ord.qty > accs[0].pp0) return ErrorCode.ORS_14;
        } else {
            var trade = this.getTrade(accs[0], ord.symbol);
            if (ord.qty > trade) return ErrorCode.ORS_15;
        }
        if (this.sessionManager.getORSSession()[ex] == Session.CLOSE) return ErrorCode.ORS_01;
	},

    validateReplace: function(oldOrd, ord) {
        var ex = "HNX"
        var accs = this.account.get(oldOrd.account);
        if (accs.length == 0) return ErrorCode.ORS_12;
        var secs = this.secinfo.get(oldOrd.symbol);
        if (secs.length == 0) return ErrorCode.ORS_13;
        if (ord.price < secs[0].floor) return ErrorCode.ORS_17;
        if (ord.price > secs[0].ceil) return ErrorCode.ORS_18;
        if (oldOrd.side == Side.BUY) {
            var priceMargin = this.afType.getPriceMargin(accs[0].afType, oldOrd.symbol);
            if ((ord.price - priceMargin) * ord.qty > accs[0].pp0 + (oldOrd.price - priceMargin)* oldOrd.qty) return ErrorCode.ORS_14;
        } else {
            var trade = this.getTrade(accs[0], oldOrd.symbol);
            if (ord.qty > trade + parseInt(oldOrd.qty)) return ErrorCode.ORS_15;
        }
        if (this.sessionManager.getORSSession()[ex] == Session.CLOSE) return ErrorCode.ORS_01;
        if (ord.qty <= oldOrd.avgQty) {
            return ErrorCode.ORS_03;
        }
    },

    validateUnhold: function() {
        var ex = "HNX"
        if (this.sessionManager.getExchangeSession()[ex] == Session.CLOSE) return ErrorCode.EX_05;
    },

    validateCancel: function() {
        var ex = "HNX"
        if (this.sessionManager.getORSSession()[ex] == Session.CLOSE) return ErrorCode.ORS_01;
    },

    getTrade: function(acc, symbol) {
        var secs = acc.secs;
        for (var i = 0; i < secs.length; i++) {
            if(secs[i]['symbol'] == symbol) {
                return secs[i]['qty'];
            }
        }
        return 0;
    }
}	
