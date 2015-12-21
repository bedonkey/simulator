ExchangeController = function($scope, exchange, exSecinfo) {
    $scope.search = {
        symbol : ''
    };
    
    $scope.init = function() {
        $scope.orderBuy = exchange.getAllOrderBuy();
        $scope.orderSell = exchange.getAllOrderSell();
        $scope.session = exchange.getSession();
    }

    $scope.openSession = function() {
    	$scope.session = 'OPEN';
    	exchange.open();
    }

    $scope.closeSession = function() {
    	$scope.session = 'CLOSE';
    	exchange.close();
        exchange.expiredOrders();
    }
    $scope.init();

    $scope.secs = exSecinfo.getAll();

    $scope.openEditBox = function(sec) {
        $scope.mask=true;
        $scope.popupOpen=true;
        $scope.secDetail = sec;
    }

    $scope.closeEditBox = function() {
        $scope.isAddBox = false;
    }

    $scope.openAddBox = function() {
        $scope.isAddBox = true;
        $scope.secDetail = {};
        $scope.secAddError = "";
    }

    $scope.add = function() {
        var result = exSecinfo.add($scope.secDetail);
        if(result != "") {
            $scope.secAddError = result;
        } else {
            $scope.mask = false;
            $scope.popupOpen = false;
        }
    }

    $scope.remove = function(sec) {
        exSecinfo.delete(sec.symbol);
        $scope.secs = exSecinfo.get($scope.search.symbol);
    }
} 