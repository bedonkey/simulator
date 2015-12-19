TabController = function($scope) {
    var tabUrl = {};
    tabUrl["orderbook"] = "app/modules/home/orderbook/orderbook.html";
    tabUrl["priceboard"] = "app/modules/home/priceboard/priceboard.html";
    tabUrl["ex-monitor"] = "app/modules/exchange/monitor.html";
    tabUrl["ex-orders"] = "app/modules/exchange/orders.html";
    tabUrl["ex-secinfo"] = "app/modules/exchange/secinfo.html";
    tabUrl["ors-account"] = "app/modules/ors/account/account.html";
    tabUrl["ors-secinfo"] = "app/modules/ors/secinfo/secinfo.html";
    tabUrl["ors-aftype"] = "app/modules/ors/aftype/aftype.html";
    tabUrl["ors-basket"] = "app/modules/ors/basket/basket.html";
    tabUrl["robottest"] = "app/modules/robottest/robot/robot.html";

    $scope.isShowDock = true;
    $scope.currentTab = tabUrl["orderbook"];

    $scope.onClickTabRobot = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["robottest"];
    }

    $scope.onClickTabPriceBoard = function () {
        $scope.isShowDock = true;
        $scope.currentTab = tabUrl["priceboard"];
    }

    $scope.onClickTabOrderBook = function () {
        $scope.isShowDock = true;
        $scope.currentTab = tabUrl["orderbook"];
    }

    $scope.onClickTabHome = function () {
        $scope.isShowDock = true;
        var curTab = tabUrl["orderbook"];
        var homeTab = angular.element("#home li");
        angular.forEach(homeTab, function(e) {
            var elem = angular.element(e);
            if(elem.hasClass('active')) {
                curTab = tabUrl[elem.find('a').attr('href')];
            }
        });
        $scope.currentTab = curTab;
    }

    $scope.onClickTabExchange = function () {
        $scope.isShowDock = false;
        var curTab = tabUrl["ex-monitor"];
        var homeTab = angular.element("#exchange li");
        angular.forEach(homeTab, function(e) {
            var elem = angular.element(e);
            if(elem.hasClass('active')) {
                curTab = tabUrl[elem.find('a').attr('href')];
            }
        });
        $scope.currentTab = curTab;
    }

    $scope.onClickTabExchangeMonitor = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["ex-monitor"];
    }

    $scope.onClickTabExchangeOrders = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["ex-orders"];
    } 

    $scope.onClickTabExchangeSecInfo = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["ex-secinfo"];
    } 

    $scope.onClickTabORSBasket = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["ors-basket"];
    }

    $scope.onClickTabORS = function () {
        $scope.isShowDock = false;
        var curTab = tabUrl["ors-account"];
        var homeTab = angular.element("#orstab li");
        angular.forEach(homeTab, function(e) {
            var elem = angular.element(e);
            if(elem.hasClass('active')) {
                curTab = tabUrl[elem.find('a').attr('href')];
            }
        });
        $scope.currentTab = curTab;
    }

    $scope.onClickTabORSAfType = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["ors-aftype"];
    }

    $scope.onClickTabORSSecInfo = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["ors-secinfo"];
    }

    $scope.onClickTabORSAccount = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["ors-account"];
    }
} 