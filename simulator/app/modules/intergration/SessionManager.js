SessionManager = function(dockService) {
	this.dockService = dockService;
};

SessionManager.prototype = {

	getExchangeSession: function() {
		return Session.ex.CUR;
	},

	closeExchange: function() {
		Session.ex.CUR = Session.ex.CLOSE;
		this.dockService.setSession(Session.ex.CLOSE);
	},

	openExchange: function() {
		Session.ex.CUR = Session.ex.OPEN;
		this.dockService.setSession(Session.ex.OPEN);
	},

	setExchangeSession: function(session) {
		Session.ex.CUR = session;
		this.dockService.setSession(session);
	},

	getGatewaySession: function() {
		return Session.gw.CUR;
	},

	setGatewaySession: function(session) {
		Session.gw.CUR = session;
	},

	getORSSession: function() {
		return Session.ors.CUR;
	},

	setORSSession: function(session) {
		Session.ors.CUR = session;
	},

}	
