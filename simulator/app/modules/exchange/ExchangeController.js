ExchangeController = function($scope, exchange, exSecinfo, sessionManager) {
    $scope.search = {
        symbol : ''
    };
    
    $scope.init = function() {
        $scope.orderBuy = exchange.getAllOrderBuy();
        $scope.orderSell = exchange.getAllOrderSell();
        $scope.session = sessionManager.getSession();
    }

    $scope.openSession = function() {
    	$scope.session = 'OPEN';
    	sessionManager.open();
    }

    $scope.closeSession = function() {
    	$scope.session = 'CLOSE';
    	sessionManager.close();
        exchange.expiredOrders();
    }
    $scope.init();
} 