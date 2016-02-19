SessionManager = function(dockService) {
	this.dockService = dockService;
};

SessionManager.prototype = {

	getExchangeSession: function() {
		return Session.ex;
	},

	setExchangeSession: function(ex, session) {
		console.log("Set exchange " + ex + " to session " + session)
		Session.ex[ex] = session;
	},

	getGatewaySession: function() {
		return Session.gw;
	},

	setGatewaySession: function(ex, session) {
		Session.gw[ex] = session;
	},

	getORSSession: function() {
		return Session.ors;
	},

	setORSSession: function(ex, session) {
		Session.ors[ex] = session;
		this.dockService.setSession(Session.ors);
	},

}	
