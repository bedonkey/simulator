Account = function(accountValidator, afType) {
	this.accountValidator = accountValidator;
	this.afType = afType;
	var accounts;
	this.init();
};

Account.prototype = {
	init: function() {
		accounts = {};
		accounts = InitData.accounts;
		for (var i = 0; i < accounts.length; i++) {
			this.refresh(accounts[i]);
		}
	},

	getAll: function() {
		return accounts;
	},

	add: function(account) {
        var error = this.accountValidator.clientValidate(account);
        if (error != '' && this.checkExist(account.id)) {
	        error = "Account Exist";
	    }
		if (error == "") {
			account.pp0 = 0;
        	account.ppcash = 0;
        	account.hold = 0;
	        accounts.push(account);
	        this.refresh(account);
        }
        return error;
	},

	delete: function(account) {
		for (var i = 0; i < accounts.length; i++) {
            if (account.id == accounts[i].id) {
                accounts.splice(i, 1);
            }
        };
	},

	checkExist: function(accountId) {
        for (var i = 0; i < accounts.length; i++) {
            if (accountId == accounts[i].id) {
                return true;
            }
        }
        return false;
    },

    get: function(accountID) {
		var newAccs = [];
		for (var i = 0; i < accounts.length; i++) {
            if (accountID == undefined  || accountID == ''  || accounts[i].id == accountID) {
                newAccs.push(accounts[i]);
            }
        };
		return newAccs;
	},

	getByID: function(accountID) {
		var newAccs = [];
		for (var i = 0; i < accounts.length; i++) {
            if (accountID == undefined  || accountID == ''  || accounts[i].id == accountID) {
                newAccs.push(accounts[i]);
            }
        };
		return newAccs[0];
	},

	getQmax: function(acc, sym, price) {
		if (acc.afType != '100') {
			var priceMargin = this.afType.getPriceMargin(acc.afType, sym);
			return Math.floor(parseInt(acc.pp0) / (parseInt(price) - priceMargin));
		} else {
			return Math.floor(parseInt(acc.pp0) / parseInt(price));
		}
	},

	hold: function(ord) {
		var acc = this.get(ord.account)[0];
		if (acc != undefined) {
			if (acc.afType != '100') {
				acc.hold += (parseInt(ord.price) - parseInt(ord.priceMargin)) * parseInt(ord.remain);
			} else {
				acc.hold += parseInt(ord.price) * parseInt(ord.remain);
			}
			this.refresh(acc);
		}
	},

	unHold: function(ord) {
		var acc = this.get(ord.account)[0];
		if (acc != undefined) {
			if (acc.afType != '100') {
				acc.hold -= (parseInt(ord.price) - parseInt(ord.priceMargin)) * parseInt(ord.remain);
			} else {
				acc.hold -= parseInt(ord.price) * parseInt(ord.remain);
			}
			
			this.refresh(acc);
		}
	},

	holdTrade: function(accountID, symbol, amount) {
		var acc = this.get(accountID)[0];
		if (acc != undefined) {
			var secs = acc.secs;
			for (var i = 0; i < secs.length; i++) {
				if (secs[i]['symbol'] == symbol) {
					secs[i]['hold'] += parseInt(amount);
					break;
				}
			}
			this.refresh(acc);
		}
	},

	unHoldTrade: function(accountID, symbol, amount) {
		var acc = this.get(accountID)[0];
		if (acc != undefined) {
			var secs = acc.secs;
			for (var i = 0; i < secs.length; i++) {
				if (secs[i]['symbol'] == symbol) {
					secs[i]['hold'] -= + parseInt(amount);
					break;
				}
			}
			this.refresh(acc);
		}
	},

	unHoldT0: function(accountID, symbol, amount) {
		var acc = this.get(accountID)[0];
		if (acc != undefined) {
			acc.t0 = acc.t0 + parseInt(amount);
			this.refresh(acc);
		}
	},

	unHoldTradeT0: function(accountID, symbol, amount) {
		var acc = this.get(accountID)[0];
		if (acc != undefined) {
			var secs = acc.secs;
			for (var i = 0; i < secs.length; i++) {
				if (secs[i]['symbol'] == symbol) {
					secs[i]['t0'] = secs[i]['t0'] + parseInt(amount);
					break;
				}
			}
			this.refresh(acc);
		}
	},

	setAfType: function(accountID, type) {
		for (var i = 0; i < accounts.length; i++) {
            if (accountID == undefined  || accountID == ''  || accounts[i].id == accountID) {
                accounts[i].afType = type;
                this.refresh(accounts[i]);
                break;
            }
        };
	},

	setAutoAdv: function(accountID) {
		for (var i = 0; i < accounts.length; i++) {
            if (accountID == undefined  || accountID == ''  || accounts[i].id == accountID) {
                accounts[i].autoAdv = true;
                this.refresh(accounts[i]);
                break;
            }
        };
	},

	disableAutoAdv: function(accountID) {
		for (var i = 0; i < accounts.length; i++) {
            if (accountID == undefined  || accountID == ''  || accounts[i].id == accountID) {
                accounts[i].autoAdv = false;
                this.refresh(accounts[i]);
                break;
            }
        };
	},

	refresh: function(acc) {
		if (acc.afType != '100') {
			var asset = 0;
			var secs = acc.secs;
			for (var i = 0; i < secs.length; i++) {
				var priceMargin = this.afType.getPriceMargin(acc.afType, secs[i].symbol);
				asset += (secs[i].qty + secs[i].t0) * priceMargin;
			}
			acc.pp0 = acc.balance + acc.t0 + asset - acc.hold;
		} else if (acc.autoAdv == true){
			acc.pp0 = acc.balance + acc.t0 - acc.hold;
		} else {
			acc.pp0 = acc.balance - acc.hold;
		}
	}
}	
