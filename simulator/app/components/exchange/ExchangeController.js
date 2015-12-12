ExchangeController = function($scope, matcher, exchange) {

    $scope.init = function() {
        $scope.orderBuy = matcher.getAllOrderBuy();
        $scope.orderSell = matcher.getAllOrderSell();
        $scope.session = exchange.getSession();
    }

    $scope.openSession = function() {
    	$scope.session = 'OPEN';
    	exchange.open();
    }

    $scope.closeSession = function() {
    	$scope.session = 'CLOSE';
    	exchange.close();
    }
    $scope.init();
} 