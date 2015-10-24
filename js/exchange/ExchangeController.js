ExchangeController = function($scope, matcher) {

    $scope.init = function() {
        $scope.orderBuy = matcher.getAllOrderBuy();
        $scope.orderSell = matcher.getAllOrderSell();
    }

    $scope.init();
} 