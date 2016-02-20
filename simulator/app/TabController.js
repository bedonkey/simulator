TabController = function($scope, $window) {
    var tabUrl = {};
    tabUrl["home-monitor"] = "app/modules/home/monitor/monitor.html";
    tabUrl["orderbook"] = "app/modules/home/orderbook/orderbook.html";
    tabUrl["priceboard"] = "app/modules/home/priceboard/priceboard.html";
    tabUrl["ex-orders"] = "app/modules/exchange/orders.html";
    tabUrl["ex-secinfo"] = "app/modules/exchange/secinfo/secinfo.html";
    tabUrl["ors-account"] = "app/modules/ors/account/account.html";
    tabUrl["ors-secinfo"] = "app/modules/ors/secinfo/secinfo.html";
    tabUrl["ors-aftype"] = "app/modules/ors/aftype/aftype.html";
    tabUrl["ors-basket"] = "app/modules/ors/basket/basket.html";
    tabUrl["mo-config"] = "app/modules/mo/config.html";
    tabUrl["gw-orderqueue"] = "app/modules/gateway/orderqueue.html";
    tabUrl["robot-keyword"] = "app/modules/robottest/keyword.html";
    tabUrl["robot-testcase"] = "app/modules/robottest/testcase.html";
    tabUrl["learn-testcase"] = "app/modules/learn/testcase.html";

    $scope.isShowDock = false;
    $scope.currentTab = tabUrl["robot-testcase"];

    $scope.onClickTab = function (tab) {
        $scope.isShowDock = false;
        var curTab;
        var homeTab = angular.element(tab + " li");
        angular.forEach(homeTab, function(e) {
            var elem = angular.element(e);
            if(elem.hasClass('active')) {
                curTab = tabUrl[elem.find('a').attr('href')];
            }
        });
        if (curTab == undefined) {
            var firstTab = angular.element(tab + " li").first();
            curTab = tabUrl[firstTab.find('a').attr('href')];
            firstTab.addClass('active');
        }
        $scope.currentTab = curTab;
    }

    $scope.onClickLogo = function () {
        $window.location.reload();
    }

    $scope.onClickTabHomeMonitor = function () {
        $scope.isShowDock = false;
        $scope.currentTab = tabUrl["home-monitor"];
    }

    $scope.onClickTabPriceBoard = function () {
        $scope.isShowDock = true;
        $scope.currentTab = tabUrl["priceboard"];
    }

    $scope.onClickTabOrderBook = function () {
        $scope.isShowDock = true;
        $scope.currentTab = tabUrl["orderbook"];
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

    $scope.onClickTabORSAfType = function () {
        $scope.currentTab = tabUrl["ors-aftype"];
    }

    $scope.onClickTabORSSecInfo = function () {
        $scope.currentTab = tabUrl["ors-secinfo"];
    }

    $scope.onClickTabORSAccount = function () {
        $scope.currentTab = tabUrl["ors-account"];
    }

    $scope.onClickTabRobotKeywords = function () {
        $scope.currentTab = tabUrl["robot-keyword"];
    }

    $scope.onClickTabRobotTestcases = function () {
        $scope.currentTab = tabUrl["robot-testcase"];
    }
} 