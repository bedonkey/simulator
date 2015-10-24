DockService = function(account, secinfo) {
    this.account = account;
    this.secinfo = secinfo;
    dockInfo = {
        acc : '',
        balance : '',
        pp0 : '',
        trade : '',
        sym : '',
        floor : '',
        ceil : '',
        
    };
    currentAcc = '';
    currentSym = '';
    currentSide = '';
    currentPrice = '';
};

DockService.prototype = {
    initDock: function() {
        return dockInfo;
    },

    setCurrentAcc: function(accId) {
        currentAcc = accId;
    },

    setCurrentSym: function(sym) {
        currentSym = sym;
    },

    setCurrentSide: function(side) {
        currentSide = side;
    },

    setCurrentPrice: function(price) {
        currentPrice = price;
    },

    refreshAccount: function() {
        dockInfo.acc = currentAcc;
        if (currentAcc == '') {
            dockInfo.pp0 = '';
            dockInfo.trade = '';
        } else {
            var acc = this.account.get(currentAcc);
            if(acc.length == 0) {
                dockInfo.pp0 = '';
                dockInfo.trade = '';
            } else {
                this.updateTrade();
                dockInfo.pp0 = 'pp0: ' + acc[0].pp0;
            }
        }
    },

    updateTrade: function() {
        dockInfo.trade = '';
        var acc = this.account.get(dockInfo.acc);
        if(acc.length != 0) {
            var secs = acc[0].secs;
            for (var i = 0; i < secs.length; i++) {
                if(secs[i]['symbol'] == dockInfo.sym) {
                    if (currentSide == 'Sell') {
                        var trade = parseInt(secs[i]['qty']) - parseInt(secs[i]['hold']);
                        dockInfo.trade = ' Trade: ' + trade;
                    } else {
                        if (currentPrice != '' && currentPrice != undefined) {
                            dockInfo.trade = ' Qmax: ' + this.account.getQmax(acc[0], dockInfo.sym, currentPrice);
                        }
                        
                    }
                }
            }
        }
    },

    refeshSymbol: function() {
        dockInfo.sym = currentSym;
        if (currentSym.length == 3) {
            var sec = this.secinfo.get(currentSym);
            if(sec.length > 0) {
                this.updateTrade();
                dockInfo.floor = 'Floor: ' + sec[0].floor; 
                dockInfo.ceil = 'Ceil: ' + sec[0].ceil; 
            }
        } else {
            dockInfo.floor = ''; 
            dockInfo.ceil = '';
            dockInfo.trade = '';
        }
    }
}   
