Interpreter = function(logScreen, order, account, exchange) {
	this.logScreen = logScreen;
    this.order = order;
    this.account = account;
    this.exchange = exchange;
};

Interpreter.prototype = {
    runTest: function(testcases) {
        variables = {};
        var result = undefined;
        if (testcases == undefined) {
            return;
        }

    	var tests = testcases.split(/\n/);
    	for (var i = 0; i < tests.length; i++) {
            var vab = '';
            if (tests[i] == '' || tests[i].indexOf('#') == 0) {
                continue;
            }
            if (tests[i].indexOf('=') > 0) {
                var vab = tests[i].substring(0, tests[i].indexOf('=')).trim();
                var testfunc = tests[i].substring(tests[i].indexOf('=') + 1, tests[i].length).trim();
            } else {
                var testfunc = tests[i];
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
        return this.order.place(orderPlace);
    },

    doReplace: function(para) {
        var orderReplace = {};
        orderReplace.orderID = this.getValuePara(para[0].trim());
        orderReplace.price = parseInt(para[1].trim());
        orderReplace.qty = parseInt(para[2].trim());
        this.logScreen.append("Replace Order: " + JSON.stringify(orderReplace));
        return this.order.replace(orderReplace);
    },

    doCancel: function(para) {
        var orderCancel = {};
        orderCancel.orderID = para;
        this.logScreen.append("Cancel Order: " + JSON.stringify(orderCancel));
        return this.order.cancel(orderCancel);
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

    doResetAccounts: function() {
        this.logScreen.append("Reset Accounts")
        this.account.init();
    },

    doOpenExchange: function() {
        this.logScreen.append("Open Exchange")
        this.exchange.open();
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
