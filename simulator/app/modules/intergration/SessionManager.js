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

	getGatewaySession: function() {
		return Session.gw.CUR;
	},

	closeGateway: function() {
		Session.gw.CUR = Session.gw.CLOSE;
	},

	openGateway: function() {
		Session.gw.CUR = Session.gw.OPEN;
	},

	getORSSession: function() {
		return Session.ors.CUR;
	},

	setORSSession: function(session) {
		Session.ors.CUR = session;
	},

	closeORS: function() {
		Session.ors.CUR = Session.ors.CLOSE;
	},

	openORS: function() {
		Session.ors.CUR = Session.ors.OPEN;
	}

}	
