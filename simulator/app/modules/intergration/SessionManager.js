SessionManager = function(dockService) {
	this.session = Session.INIT;
	this.dockService = dockService;
};

SessionManager.prototype = {

	init: function() {
	},

	getSession: function() {
		return this.session;
	},

	close: function() {
		this.session = Session.CLOSE;
		this.dockService.setSession(Session.CLOSE);
	},

	open: function() {
		this.session = Session.OPEN;
		this.dockService.setSession(Session.OPEN);
	}

}	
