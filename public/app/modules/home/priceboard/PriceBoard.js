PriceBoard = function(secinfo) {
	board = {};
	this.secinfo = secinfo;
	this.init();
};

PriceBoard.prototype = {
	init: function() {
		var secs = this.secinfo.getAll();
		for (var i = 0; i < secs.length; i++) {
			var row = secs[i];
			row['total'] = 0;
			row['sell'] = [];
			row['buy'] = [];
			row['matchPx'] = 0;
			row['matchQty'] = 0;
            board[secs[i].symbol] = row;
        };
	},

	add: function(sym, side, px, qty) {
		var row = board[sym];
		if (side == Side.SELL) {
			for (var i = 0; i < row['sell'].length; i++) {
	            if (px == row['sell'][i].px) {
	                row['sell'][i].qty += parseInt(qty);
	                return;
	            }
	        };
			if (row['sell'].length == 0) {
        		row['sell'].push({'px':px,'qty': parseInt(qty)});
        	} else {
	        	for (var j = 0; j < row['sell'].length; j++) {
	        		if(row['sell'][j].px < px) {
	        			row['sell'].splice(j, 0, {'px':px,'qty':qty});
	        			return;
	        		}
	        	}
	        	row['sell'].splice(row['sell'].length, 0, {'px':px,'qty':qty});
        	}
			
		} else {
			for (var i = 0; i < row['buy'].length; i++) {
	            if (px == row['buy'][i].px) {
	                row['buy'][i].qty += parseInt(qty);
	                return;
	            }
	        };
        	if (row['buy'].length == 0) {
        		row['buy'].push({'px':px,'qty': parseInt(qty)});
        	} else {
	        	for (var j = 0; j < row['buy'].length; j++) {
	        		if(row['buy'][j].px < px) {
	        			row['buy'].splice(j, 0, {'px':px,'qty':qty});
	        			return;
	        		}
	        	}
	        	row['buy'].splice(row['buy'].length, 0, {'px':px,'qty':qty});
        	}
		}
	},

	subtract: function(sym, side, px, qty) {
		var row = board[sym];
		if (side == Side.SELL) {
			for (var i = 0; i < row['sell'].length; i++) {
	            if (px == row['sell'][i].px) {
	                row['sell'][i].qty -= parseInt(qty);
	                if (row['sell'][i].qty == 0) {
	                	row['sell'].splice(i, 1);
	                }
	                break;
	            }
	        };
		} else {
			for (var i = 0; i < row['buy'].length; i++) {
	            if (px == row['buy'][i].px) {
	                row['buy'][i].qty -= parseInt(qty);
	                if (row['buy'][i].qty == 0) {
	                	row['buy'].splice(i, 1);
	                }
	                break;
	            }
	        };
		}
	},

	remove: function(sym, side, px, qty) {
		var row = board[sym];
		if (side == Side.SELL) {
			for (var i = 0; i < row['sell'].length; i++) {
	            if (px == row['sell'][i].px) {
	                row['sell'][i].qty -= parseInt(qty);
	                if (row['sell'][i].qty == 0) {
	                	row['sell'].splice(i, 1);
	                }
	                break;
	            }
	        };
		} else {
			for (var i = 0; i < row['buy'].length; i++) {
	            if (px == row['buy'][i].px) {
	                row['buy'][i].qty -= parseInt(qty);
	                if (row['buy'][i].qty == 0) {
	                	row['buy'].splice(i, 1);
	                }
	                break;
	            }
	        };
		}
	},

	addMatch: function(sym, px, qty) {
		var row = board[sym];
		row['matchPx'] = px;
		row['matchQty'] = qty;
		row['total'] += parseInt(qty);
	},

	getAll: function() {
		return board;
	}
}	
