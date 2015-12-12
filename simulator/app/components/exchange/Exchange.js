Exchange = function(dockService) {
	orders = [];
	session = 'CLOSE';
	this.dockService = dockService;
};

Exchange.prototype = {

	init: function() {
		orders.length = 0;
	},

	getAll: function() {
		return orders;
	},

	add: function(ord) {
		orders.push(ord);
	},

	getSession: function() {
		return session;
	},

	close: function() {
		session = 'CLOSE';
		this.dockService.setSession('CLOSE');
	},

	open: function() {
		session = 'OPEN';
		this.dockService.setSession('OPEN');
	}

}	
