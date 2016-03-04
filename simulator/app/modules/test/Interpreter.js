variables = {};
Interpreter = function(logScreen, account, ors, gateway, exchange) {
	this.logScreen = logScreen;
    this.account = account;
    this.ors = ors;
    this.exchange = exchange;
    this.gateway = gateway;
};

Interpreter.prototype = {
    runTest: function(testcases) {
        if (testcases == undefined) {
            return;
        }
    	var tests = testcases.content.split(/\n/);
    	for (var i = 0; i < tests.length; i++) {
            if (tests[i].trim() == '' || tests[i].indexOf('#') == 0) {
                continue;
            }
            testcases.index++;
            if (this.runLine(tests[i]) == false) {
                return false; 
            }
    	};
    	return true;
    },

    runLine: function(line) {
        var vab = '';
        
        var testData = line.split('#')[0];
        if (testData.indexOf('=') > 0) {
            var vab = testData.substring(0, testData.indexOf('=')).trim();
            var testfunc = testData.substring(testData.indexOf('=') + 1, testData.length).trim();
        } else {
            var testfunc = testData;
        }
        var func = testfunc.substring(0, testfunc.indexOf('('));
        var para = testfunc.substring(testfunc.indexOf('(') + 1, testfunc.indexOf(')')).split(',');
        switch(func) {
            case 'Log':
                if (para in variables) {
                    para = variables[para];
                }
                this.doLog(para);
                break;
            case 'Compare':
                this.doCompare(para);
                break;
            case 'Assert':
                if (this.doAssert(para) == false) {
                    return false;
                }
                break;
            case 'Place':
                var retu = this.doPlace(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'Cancel':
                para = this.getValuePara(para[0]);
                var retu = this.doCancel(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'Unhold':
                para = this.getValuePara(para[0]);
                var retu = this.doUnhold(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'Replace':
                var retu = this.doReplace(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'GetPP0':
                var retu = this.doGetPP0(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'GetQmax':
                var retu = this.doGetQmax(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'GetAfType':
                var retu = this.doGetAfType(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'GetAutoAdv':
                var retu = this.doGetAutoAdv(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'GetOrderStatus':
                para = this.getValuePara(para[0]);
                var retu = this.doGetOrderStatus(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'GetOrderEvent':
                para = this.getValuePara(para[0]);
                var retu = this.doGetOrderEvent(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'CountOrderDetail':
                para = this.getValuePara(para[0]);
                var retu = this.doCountOrderDetail(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
                break;
            case 'SetAfType':
                this.doSetAfType(para);
                break;
            case 'SetAutoAdv':
                this.doSetAutoAdv(para);
                break;
            case 'DisableAutoAdv':
                this.doDisableAutoAdv(para);
                break;
            case 'ResetAccounts':
                this.doResetAccounts();
                break;
            case 'SetExchangeSession':
                this.doSetExchangeSession(para);
                break;
            case 'SetGatewaySession':
                this.doSetGatewaySession(para);
                break;
            case 'SetORSSession':
                this.doSetORSSession(para);
                break;
            case 'ClearExchange':
                this.doClearExchange();
                break;
            case 'UnholdAllOrders':
                this.doUnholdAllOrders();
                break;
        }
    },

    doLog: function(para) {
        var log = '';
        if (typeof(para) == 'object') {
            log = JSON.stringify(para);
        } else {
            log = para;
        }
    	this.logScreen.append("Log: " + log);
    },

    doCompare: function(para) {
    	var result = (para[0].trim() == para[1].trim());
    	this.logScreen.append("Compare: " + result);
    	return result;
    },

    doAssert: function(para) {
        var para0 = this.getValuePara(para[0].trim());
        var para1 = para[1].trim();
        var result = (String(para0) == String(para1));
        this.logScreen.append("Assert: " + result + " Value: '" + para0 + "' Expected: '" + para1 + "'");
        return result;
    },

    doPlace: function(para) {
        var orderPlace = {};
        orderPlace.account = para[0].trim();
        orderPlace.symbol = para[1].trim();
        orderPlace.side = para[2].trim();
        orderPlace.price = parseInt(para[3].trim());
        orderPlace.qty = parseInt(para[4].trim());
        this.logScreen.append("Place Order: " + JSON.stringify(orderPlace));
        return this.ors.place(orderPlace);
    },

    doReplace: function(para) {
        var orderReplace = {};
        orderReplace.orderID = this.getValuePara(para[0].trim());
        orderReplace.price = parseInt(para[1].trim());
        orderReplace.qty = parseInt(para[2].trim());
        this.logScreen.append("Replace Order: " + JSON.stringify(orderReplace));
        return this.ors.replace(orderReplace);
    },

    doCancel: function(para) {
        var ord = {};
        ord.orderID = para;
        this.logScreen.append("Cancel Order: " + JSON.stringify(ord));
        return this.ors.cancel(ord);
    },

    doUnhold: function(para) {
        var ord = {};
        ord.orderID = para;
        this.logScreen.append("Unhold Order: " + ord);
        return this.ors.unhold(ord);
    },

    doGetPP0: function(para) {
        this.logScreen.append("Get PP0 acc: " + para[0])
        return this.account.getByID(para[0].trim()).pp0;
    },

    doGetQmax: function(para) {
        this.logScreen.append("Get Qmax acc: " + para[0])
        var acc = this.account.getByID(para[0]);
        return this.account.getQmax(acc, para[1].trim(), para[2].trim());
    },

    doGetAfType: function(para) {
        this.logScreen.append("Get AfType acc: " + para[0])
        return this.account.getByID(para[0].trim()).afType;
    },

    doGetAutoAdv: function(para) {
        this.logScreen.append("Get AutoAdv acc: " + para[0])
        return this.account.getByID(para[0].trim()).autoAdv;
    },

    doSetAfType: function(para) {
        this.logScreen.append("Set AfType acc: " + para)
        return this.account.setAfType(para[0].trim(), para[1].trim());
    },

    doSetAutoAdv: function(para) {
        this.logScreen.append("Set AutoAdv acc: " + para)
        return this.account.setAutoAdv(para[0].trim());
    },

    doDisableAutoAdv: function(para) {
        this.logScreen.append("Disable AutoAdv acc: " + para)
        return this.account.disableAutoAdv(para[0].trim());
    },

    doGetOrderStatus: function(para) {
        this.logScreen.append("Get Order Status: " + para)
        return this.ors.getOrderStatus(para);
    },

    doGetOrderEvent: function(para) {
        this.logScreen.append("Get Order Event: " + para)
        return this.ors.getOrderEvent(para);
    },

    doCountOrderDetail: function(para) {
        this.logScreen.append("count Order Detail: " + para)
        return this.ors.countOrderDetail(para);
    },

    doResetAccounts: function() {
        this.logScreen.append("Reset Accounts")
        this.account.init();
    },

    doSetGatewaySession: function(para) {
        this.logScreen.append("Set Gateway Sesison " + para[0] + " to " + para[1])
        this.gateway.setSession(para[0].trim(), para[1].trim());
    },

    doSetExchangeSession: function(para) {
        this.logScreen.append("Set Exchange Session " + para[0] + " to " + para[1])
        this.exchange.setSession(para[0].trim(), para[1].trim());
    },

    doSetORSSession: function(para) {
        this.logScreen.append("Set ORS session to " + para[0] + " to " + para[1])
        this.ors.setSession(para[0].trim(), para[1].trim());
    },

    doClearExchange: function() {
        this.logScreen.append("Clear Exchange")
        this.exchange.expiredOrders();
        this.exchange.init();
        this.gateway.init();
    },

    doUnholdAllOrders: function() {
        this.logScreen.append("Unhold All Orders")
        this.ors.unholdAll();
    },

    getValuePara: function(para) {
        if (para.indexOf('.') > 0) {
            var obj = variables[para.split('.')[0]]
            return obj[para.split('.')[1]];
        } else {
            return variables[para]
        }
    }
}	
