OrderBookController = function($scope, order, orderStore, dockSerice) {

    $scope.init = function() {
        $scope.orders = orderStore.getAll();
    }

    $scope.openReplaceBox = function(ord) {
        $scope.mask=true;
        $scope.replaceBoxShow=true;
        $scope.orderReplace = Utils.clone(ord);
    }

    $scope.openDetailBox = function(orderID) {
        $scope.mask=true;
        $scope.detailBoxShow=true;
        $scope.ordersDetail = orderStore.getDetail(orderID);
    }

    $scope.closeDetailBox = function() {
        $scope.ordersDetail = [];
    }

    $scope.cancel = function(ord) {
        var result = order.cancel(ord);
        if (result.status == false) {
            alert(result.msg);
        } else {
            dockSerice.refreshAccount();
        }
    }

    $scope.unhold = function(ord) {
        var result = order.unhold(ord);
        if (result.status == false) {
            alert(result.msg);
        } else {
            dockSerice.refreshAccount();
        }
    }

    $scope.unholdAll = function() {
        $scope.orders.forEach(function(ord) {
            order.unhold(ord);
            dockSerice.refreshAccount();
        });
    }

    $scope.replace = function() {
        var result = order.replace($scope.orderReplace);
        if (result.status == false) {
            alert(result.msg);
        } else {
            dockSerice.refreshAccount();
            $scope.replaceBoxShow = false;
            $scope.mask = false;
        }
    }

    $scope.init();
} 