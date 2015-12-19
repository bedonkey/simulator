ExchangeController = function($scope, exchange, ex_secinfo) {
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

    $scope.secs = ex_secinfo.getAll();

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
        var result = ex_secinfo.add($scope.secDetail);
        if(result != "") {
            $scope.secAddError = result;
        } else {
            $scope.mask = false;
            $scope.popupOpen = false;
        }
    }

    $scope.remove = function(sec) {
        ex_secinfo.delete(sec.symbol);
        $scope.secs = ex_secinfo.get($scope.search.symbol);
    }
} 