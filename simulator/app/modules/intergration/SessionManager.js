SessionManager = function(dockService) {
	this.init();
	this.dockService = dockService;
};

SessionManager.prototype = {

	init: function() {
		this.exSession = Session.exchange.INIT;
		this.gwSession = Session.gateway.INIT;
		this.orsSession = Session.ors.INIT;
	},

	getExchangeSession: function() {
		return this.exSession;
	},

	closeExchange: function() {
		this.exSession = Session.exchange.CLOSE;
		this.dockService.setSession(Session.exchange.CLOSE);
	},

	openExchange: function() {
		this.exSession = Session.exchange.OPEN;
		this.dockService.setSession(Session.exchange.OPEN);
	},

	getGatewaySession: function() {
		return this.gwSession;
	},

	closeGateway: function() {
		this.gwSession = Session.gateway.CLOSE;
	},

	openGateway: function() {
		this.gwSession = Session.gateway.OPEN;
	},

	getORSSession: function() {
		return this.orsSession;
	},

	setORSSession: function(session) {
		this.orsSession = session;
	},

	closeORS: function() {
		this.orsSession = Session.ors.CLOSE;
	},

	openORS: function() {
		this.orsSession = Session.ors.OPEN;
	}

}	
