SessionManager = function(dockService) {
	this.init();
	this.dockService = dockService;
};

SessionManager.prototype = {

	init: function() {
		this.exSession = Session.ex.INIT;
		this.gwSession = Session.gw.INIT;
		this.orsSession = Session.ors.INIT;
	},

	getExchangeSession: function() {
		return this.exSession;
	},

	closeExchange: function() {
		this.exSession = Session.ex.CLOSE;
		this.dockService.setSession(Session.ex.CLOSE);
	},

	openExchange: function() {
		this.exSession = Session.ex.OPEN;
		this.dockService.setSession(Session.ex.OPEN);
	},

	getGatewaySession: function() {
		return this.gwSession;
	},

	closeGateway: function() {
		this.gwSession = Session.gw.CLOSE;
	},

	openGateway: function() {
		this.gwSession = Session.gw.OPEN;
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
