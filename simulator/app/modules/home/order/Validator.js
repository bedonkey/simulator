OrderValidator = function(account, secinfo, afType) {
  this.account = account;
  this.secinfo = secinfo;
  this.afType = afType;
};

OrderValidator.prototype = {
	clientValidate: function(ord) {
		if (ord.account == '') return "Account not empty";
        if (ord.symbol == '') return "Symbol not empty";
        if (ord.price == '') return "Price not empty";
        if (isNaN(ord.price)) return "Price not is number";
        if (ord.qty == '') return "Quantity not empty";
        if (isNaN(ord.qty)) return "Quantity not is number";
        if (ord.qty <= 0) return "Quantity must greater than 0";
	},

	validatePlace: function(ord) {
        var accs = this.account.get(ord.account);
        if (accs.length == 0) return "Account not exist";
        var secs = this.secinfo.get(ord.symbol);
        if (secs.length == 0) return "Symbol not exist";
        if (ord.price < secs[0].floor) return "Price must larger than floor price";
        if (ord.price > secs[0].ceil) return "Price must lower than ceil price";
        if (ord.side == 'Buy') {
            var priceMargin = this.afType.getPriceMargin(accs[0].afType, ord.symbol);
            if ((ord.price - priceMargin) * ord.qty > accs[0].pp0) return "Don't enough balance";
        } else {
            var trade = this.getTrade(accs[0], ord.symbol);
            if (ord.qty > trade) return "Don't enough trade";
        }
	},

    validateReplace: function(oldOrd, ord) {
        var accs = this.account.get(oldOrd.account);
        if (accs.length == 0) return "Account not exist";
        var secs = this.secinfo.get(oldOrd.symbol);
        if (secs.length == 0) return "Symbol not exist";
        if (ord.price < secs[0].floor) return "Price must larger than floor price";
        if (ord.price > secs[0].ceil) return "Price must lower than ceil price";
        if (oldOrd.side == 'Buy') {
            var priceMargin = this.afType.getPriceMargin(accs[0].afType, oldOrd.symbol);
            if ((ord.price - priceMargin) * ord.qty > accs[0].pp0 + (oldOrd.price - priceMargin)* oldOrd.qty) return "Don't enough balance";
        } else {
            var trade = this.getTrade(accs[0], oldOrd.symbol);
            if (ord.qty > trade + parseInt(oldOrd.qty)) return "Don't enough trade";
        }
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
