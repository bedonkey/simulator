TabController = function($scope) {
    var tabUrl = {};
    tabUrl["orderbook"] = "app/modules/home/orderbook/orderbook.html";
    tabUrl["priceboard"] = "app/modules/home/priceboard/priceboard.html";
    tabUrl["condition"] = "app/modules/home/condition/monitor.html";
    tabUrl["ex-monitor"] = "app/modules/exchange/monitor.html";
    tabUrl["ex-orders"] = "app/modules/exchange/orders.html";
    tabUrl["ex-secinfo"] = "app/modules/exchange/secinfo.html";
    tabUrl["ors-account"] = "app/modules/ors/account/account.html";
    tabUrl["ors-secinfo"] = "app/modules/ors/secinfo/secinfo.html";
    tabUrl["ors-aftype"] = "app/modules/ors/aftype/aftype.html";
    tabUrl["ors-basket"] = "app/modules/ors/basket/basket.html";
    tabUrl["mo-config"] = "app/modules/mo/config.html";
    tabUrl["gw-orderqueue"] = "app/modules/gateway/orderqueue.html";
    tabUrl["robot-keyword"] = "app/modules/robottest/robot/keyword.html";
    tabUrl["robot-testcase"] = "app/modules/robottest/robot/testcase.html";
    tabUrl["learn-testcase"] = "app/modules/learn/testcase.html";

    $scope.isShowDock = false;
    $scope.currentTab = "";

    $scope.onClickTabPriceBoard = function () {
        $scope.currentTab = tabUrl["priceboard"];
    }

    $scope.onClickTabOrderBook = function () {
        $scope.currentTab = tabUrl["orderbook"];
    }

    $scope.onClickTabCondition = function () {
        $scope.currentTab = tabUrl["condition"];
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
        $scope.currentTab = tabUrl["ex-monitor"];
    }

    $scope.onClickTabExchangeOrders = function () {
        $scope.currentTab = tabUrl["ex-orders"];
    } 

    $scope.onClickTabExchangeSecInfo = function () {
        $scope.currentTab = tabUrl["ex-secinfo"];
    } 

    $scope.onClickTabORSBasket = function () {
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
        $scope.currentTab = tabUrl["ors-aftype"];
    }

    $scope.onClickTabORSSecInfo = function () {
        $scope.currentTab = tabUrl["ors-secinfo"];
    }

    $scope.onClickTabORSAccount = function () {
        $scope.currentTab = tabUrl["ors-account"];
    }

    $scope.onClickTabMO = function () {
        $scope.isShowDock = false;
        var curTab = tabUrl["mo-config"];
        var homeTab = angular.element("#motab li");
        angular.forEach(homeTab, function(e) {
            var elem = angular.element(e);
            if(elem.hasClass('active')) {
                curTab = tabUrl[elem.find('a').attr('href')];
            }
        });
        $scope.currentTab = curTab;
    }

    $scope.onClickTabGateway = function () {
        $scope.isShowDock = false;
        var curTab = tabUrl["gw-orderqueue"];
        var homeTab = angular.element("#gateway li");
        angular.forEach(homeTab, function(e) {
            var elem = angular.element(e);
            if(elem.hasClass('active')) {
                curTab = tabUrl[elem.find('a').attr('href')];
            }
        });
        $scope.currentTab = curTab;
    }

    $scope.onClickTabRobot = function () {
        $scope.isShowDock = false;
        var curTab = tabUrl["robot-testcase"];
        var homeTab = angular.element("#robottest li");
        angular.forEach(homeTab, function(e) {
            var elem = angular.element(e);
            if(elem.hasClass('active')) {
                curTab = tabUrl[elem.find('a').attr('href')];
            }
        });
        $scope.currentTab = curTab;
    }

    $scope.onClickTabRobotKeywords = function () {
        $scope.currentTab = tabUrl["robot-keyword"];
    }

    $scope.onClickTabRobotTestcases = function () {
        $scope.currentTab = tabUrl["robot-testcase"];
    }

    $scope.onClickTabLearn = function () {
        $scope.isShowDock = false;
        var curTab = tabUrl["learn-testcase"];
        var homeTab = angular.element("#learn li");
        angular.forEach(homeTab, function(e) {
            var elem = angular.element(e);
            if(elem.hasClass('active')) {
                curTab = tabUrl[elem.find('a').attr('href')];
            }
        });
        $scope.currentTab = curTab;
    }
} 