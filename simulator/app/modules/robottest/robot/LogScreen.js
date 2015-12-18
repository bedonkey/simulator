LogScreen = function() {
	logData = [];
    this.init();
};

LogScreen.prototype = {
    init: function(text) {
    	logData.length = 0
        logData.push("=== Welcome console simulator ===");
    },

	append: function(text) {
		logData.push(text);
	},

	getLogData: function() {
		return logData;
	}
}	
