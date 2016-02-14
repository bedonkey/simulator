Interpreter = function(logScreen, account, ors, gateway, exchange) {
	this.logScreen = logScreen;
    this.account = account;
    this.ors = ors;
    this.exchange = exchange;
    this.gateway = gateway;
};

Interpreter.prototype = {
    runTest: function(testcases) {
        variables = {};
        var result = undefined;
        if (testcases == undefined) {
            return;
        }

    	var tests = testcases.content.split(/\n/);
    	for (var i = 0; i < tests.length; i++) {
            var vab = '';
            if (tests[i] == '' || tests[i].indexOf('#') == 0) {
                continue;
            }
            testcases.index++;
            var testData = tests[i].split('#')[0];
            if (testData.indexOf('=') > 0) {
                var vab = testData.substring(0, testData.indexOf('=')).trim();
                var testfunc = testData.substring(testData.indexOf('=') + 1, testData.length).trim();
            } else {
                var testfunc = testData;
            }
    		var func = testfunc.substring(0, testfunc.indexOf('('));
	    	var para = testfunc.substring(testfunc.indexOf('(') + 1, testfunc.indexOf(')')).split(',');
	    	if (func == 'Log') {
                if (para in variables) {
                    para = variables[para];
                }
	    		this.doLog(para);
	    	}
	    	if (func == 'Compare') {
	    		this.doCompare(para);
	    	}
            if (func == 'Assert') {
                if (this.doAssert(para) == false) {
                    result = false;
                    break;
                } else {
                    result = true;
                }
            }
            if (func == 'Place') {
                var retu = this.doPlace(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'Cancel') {
                para = this.getValuePara(para[0]);
                var retu = this.doCancel(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'Unhold') {
                para = this.getValuePara(para[0]);
                var retu = this.doUnhold(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'Replace') {
                var retu = this.doReplace(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'GetPP0') {
                var retu = this.doGetPP0(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'GetQmax') {
                var retu = this.doGetQmax(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'GetAfType') {
                var retu = this.doGetAfType(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'GetAutoAdv') {
                var retu = this.doGetAutoAdv(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'GetOrderStatus') {
                para = this.getValuePara(para[0]);
                var retu = this.doGetOrderStatus(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'GetOrderEvent') {
                para = this.getValuePara(para[0]);
                var retu = this.doGetOrderEvent(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'CountOrderDetail') {
                para = this.getValuePara(para[0]);
                var retu = this.doCountOrderDetail(para);
                if (vab != '') {
                    variables[vab] = retu;
                }
            }
            if (func == 'SetAfType') {
                this.doSetAfType(para);
            }
            if (func == 'SetAutoAdv') {
                this.doSetAutoAdv(para);
            }
            if (func == 'DisableAutoAdv') {
                this.doDisableAutoAdv(para);
            }
            if (func == 'ResetAccounts') {
                this.doResetAccounts();
            }
            if (func == 'OpenExchange') {
                this.doOpenExchange();
            }
            if (func == 'OpenGateway') {
                this.doOpenGateway();
            }
            if (func == 'OpenORS') {
                this.doOpenORS();
            }
            if (func == 'SetExchangeSession') {
                this.doSetExchangeSession(para);
            }
            if (func == 'SetGatewaySession') {
                this.doSetGatewaySession(para);
            }
            if (func == 'SetORSSession') {
                this.doSetORSSession(para);
            }
            if (func == 'ClearExchange') {
                this.doClearExchange();
            }
    	};
    	return result;
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

    doOpenGateway: function() {
        this.logScreen.append("Open Gateway")
        this.gateway.setSession(Session.gw.OPEN);
    },

    doOpenExchange: function() {
        this.logScreen.append("Open Exchange")
        this.exchange.setSession(Session.ex.OPEN);
    },

    doOpenORS: function() {
        this.logScreen.append("Open ORS")
        this.ors.setSession(Session.ors.OPEN);
    },

    doSetGatewaySession: function(session) {
        this.logScreen.append("Set Gateway Sesison to " + session)
        this.gateway.setSession(session);
    },

    doSetExchangeSession: function(session) {
        this.logScreen.append("Set Exchange Session " + session)
        this.exchange.setSession(session);
    },

    doSetORSSession: function(session) {
        this.logScreen.append("Set ORS session to " + session)
        this.ors.setSession(session);
    },

    doClearExchange: function() {
        this.logScreen.append("Clear Exchange")
        this.exchange.init();
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
