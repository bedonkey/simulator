TabController = function($scope) {
    $scope.currentTab = 'app/modules/exchange/monitor.html';

    $scope.onClickTabRobot = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/modules/robottest/robot/robot.html';
    }

    $scope.onClickTabPriceBoard = function () {
        $scope.isShowDock = true;
        $scope.currentTab = 'app/modules/home/priceboard/priceboard.html';
    }

    $scope.onClickTabOrderBook = function () {
        $scope.isShowDock = true;
        $scope.currentTab = 'app/modules/home/orderbook/orderbook.html';
    }

    $scope.onClickTabExchangeMonitor = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/modules/exchange/monitor.html';
    }

    $scope.onClickTabExchangeOrders = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/modules/exchange/orders.html';
    } 

    $scope.onClickTabExchangeSecInfo = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/modules/exchange/secinfo.html';
    } 

    $scope.onClickTabORSBasket = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/modules/ors/basket/basket.html';
    } 

    $scope.onClickTabORSAfType = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/modules/ors/aftype/aftype.html';
    }

    $scope.onClickTabORSSecInfo = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/modules/ors/secinfo/secinfo.html';
    }

    $scope.onClickTabORSAccount = function () {
        $scope.isShowDock = false;
        $scope.currentTab = 'app/modules/ors/account/account.html';
    }
} 