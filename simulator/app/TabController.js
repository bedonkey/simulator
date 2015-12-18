TabController = function($scope) {
    $scope.currentTab = 'app/components/exchange/monitor.html';

    $scope.onClickTabRobot = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/components/robot/robot.html';
    }

    $scope.onClickTabPriceBoard = function () {
        $scope.isShowDock = true;
        $scope.currentTab = 'app/components/priceboard/priceboard.html';
    }

    $scope.onClickTabOrderBook = function () {
        $scope.isShowDock = true;
        $scope.currentTab = 'app/components/orderbook/orderbook.html';
    }

    $scope.onClickTabExchangeMonitor = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/components/exchange/monitor.html';
    }

    $scope.onClickTabExchangeOrders = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/components/exchange/orders.html';
    } 

    $scope.onClickTabExchangeSecInfo = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/components/exchange/secinfo.html';
    } 

    $scope.onClickTabORSBasket = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/components/basket/basket.html';
    } 

    $scope.onClickTabORSAfType = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/components/aftype/aftype.html';
    }

    $scope.onClickTabORSSecInfo = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/components/secinfo/secinfo.html';
    }

    $scope.onClickTabORSAccount = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/components/account/account.html';
    }
} 