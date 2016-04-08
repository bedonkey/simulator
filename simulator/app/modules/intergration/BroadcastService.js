BroadcastService = function($rootScope) {
  this.rootScope = $rootScope;
};

BroadcastService.prototype = {
	send: function(queue, msg) {
        this.rootScope.$broadcast(queue, msg);
	},
	
	receive: function(queue, callback) {
        this.rootScope.$on(queue, callback);
	}
}	
