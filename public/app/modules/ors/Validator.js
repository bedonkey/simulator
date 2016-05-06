OrderValidator = function(account, secinfo, afType, sessionManager) {
  this.account = account;
  this.secinfo = secinfo;
  this.afType = afType;
  this.sessionManager = sessionManager;
};

OrderValidator.prototype = {
	clientValidate: function(ord) {
		if (ord.account === '') return ErrorCode.ORS_05;
        if (ord.symbol === '') return ErrorCode.ORS_06;
        if (ord.price === '') return ErrorCode.ORS_07;
        if (isNaN(ord.price)) return ErrorCode.ORS_08;
        if (ord.qty === '') return ErrorCode.ORS_09;
        if (isNaN(ord.qty)) return ErrorCode.ORS_10;
        if (ord.qty <= 0) return ErrorCode.ORS_11;
	},

	validatePlace: function(ex, ord) {
        var orsSession = this.sessionManager.getORSSession()[ex];
        var accs = this.account.get(ord.account);
        if (accs.length == 0) return ErrorCode.ORS_12;
        var secs = this.secinfo.get(ord.symbol);
        if (secs.length == 0) return ErrorCode.ORS_13;
        
        if (ex == "HNX") {
            if (ord.type == OrdType.ATO) return ErrorCode.ORS_20;
            if (ord.type == OrdType.MP) return ErrorCode.ORS_26;
            if (ord.type == OrdType.MTL && orsSession == Session.NEW) return ErrorCode.ORS_30;
            if (ord.type == OrdType.MTL && orsSession == Session.ATO) return ErrorCode.ORS_31;
            if (ord.type == OrdType.MTL && orsSession == Session.ATC) return ErrorCode.ORS_32;

            if (ord.type == OrdType.MOK && orsSession == Session.NEW) return ErrorCode.ORS_33;
            if (ord.type == OrdType.MOK && orsSession == Session.ATO) return ErrorCode.ORS_34;
            if (ord.type == OrdType.MOK && orsSession == Session.ATC) return ErrorCode.ORS_35;

            if (ord.type == OrdType.MAK && orsSession == Session.NEW) return ErrorCode.ORS_36;
            if (ord.type == OrdType.MAK && orsSession == Session.ATO) return ErrorCode.ORS_37;
            if (ord.type == OrdType.MAK && orsSession == Session.ATC) return ErrorCode.ORS_38;
        } else if (ex == "HOSE") {
            if (ord.type == OrdType.MTL) return ErrorCode.ORS_27;
            if (ord.type == OrdType.MOK) return ErrorCode.ORS_28;
            if (ord.type == OrdType.MAK) return ErrorCode.ORS_29;
            if (ord.type == Session.ATO && orsSession != Session.NEW && orsSession != Session.ATO) return ErrorCode.ORS_22;

            if (ord.type == OrdType.MP && orsSession == Session.NEW) return ErrorCode.ORS_23;
            if (ord.type == OrdType.MP && orsSession == Session.ATO) return ErrorCode.ORS_24;
            if (ord.type == OrdType.MP && orsSession == Session.ATC) return ErrorCode.ORS_25;
        }

        if (ord.price > 0 && ord.price < secs[0].floor) return ErrorCode.ORS_17;
        if (ord.price > 0 && ord.price > secs[0].ceil) return ErrorCode.ORS_18;
        if (ord.price > 0 && !this.valiatePriceSpread(ex, ord.price)) {
            return ErrorCode.ORS_19;
        }
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

    validateReplace: function(ex, oldOrd, ord) {
        var accs = this.account.get(oldOrd.account);
        if (accs.length == 0) return ErrorCode.ORS_12;
        var secs = this.secinfo.get(oldOrd.symbol);
        if (secs.length == 0) return ErrorCode.ORS_13;
        if (ord.price < secs[0].floor && ord.type != Session.ATO) return ErrorCode.ORS_17;
        if (ord.price > secs[0].ceil && ord.type != Session.ATO) return ErrorCode.ORS_18;
        if (!this.valiatePriceSpread(ex, ord.price)) {
            return ErrorCode.ORS_19;
        }
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

    validateUnhold: function(ex) {
        if (this.sessionManager.getExchangeSession()[ex] == Session.CLOSE) return ErrorCode.EX_05;
    },

    validateCancel: function(ex) {
        if (this.sessionManager.getORSSession()[ex] == Session.CLOSE) return ErrorCode.ORS_01;
    },

    valiatePriceSpread: function(ex, price) {
        if (ex == "HNX") {
            if (price % 100 != 0) {
                return false;
            }
        }
        if (ex == "HOSE") {
            if (price <= 50000 && price % 100 != 0) {
                return false;
            }
            if (price > 50000 && price < 100000 && price % 500 != 0) {
                return false;
            }
            if (price >= 100000 && price % 1000 != 0) {
                return false;
            }
        }
        return true;
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
