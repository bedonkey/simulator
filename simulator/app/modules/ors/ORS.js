ORS = function(order, sessionManager) {
	this.order = order;
	this.sessionManager = sessionManager;
};

ORS.prototype = {

	init: function() {
	},

	setSession: function(session) {
		if (session == Session.ors.OPEN) {
            console.log("Push order to Exchange");
            this.order.fireOrder();
        }
        this.sessionManager.setORSSession(session);
	},

	getSession: function() {
		return this.sessionManager.getORSSession();
	}
}	
