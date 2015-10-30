TabController = function($scope) {
    $scope.tabs = [
        {
            title: 'Order Book',
            url: 'app/components/orderbook/orderbook.html'
        }, {
            title: 'Price Board',
            url: 'app/components/priceboard/priceboard.html'
        }, {
            title: 'Exchange',
            url: 'app/components/exchange/exchange.html'
        }, {
            title: 'RobotTest',
            url: 'app/components/robot/robot.html'
        }
    ];

    $scope.tabsSetting = [
        {
            title: 'Account',
            url: 'app/components/account/account.html'
        }, {
            title: 'SecInfo',
            url: 'app/components/secinfo/secinfo.html'
        },{
            title: 'AfType',
            url: 'app/components/aftype/aftype.html'
        }, {
            title: 'Basket',
            url: 'app/components/basket/basket.html'
        }
    ];

    $scope.currentTab = 'app/components/orderbook/orderbook.html';

    $scope.showDock = function() {
        if ($scope.currentTab == 'orderbook.html' || $scope.currentTab == 'priceboard.html' || $scope.currentTab == 'exchange.html') {
            $scope.isShowDock = true;
        } else {
            $scope.isShowDock = false;
        }
    }
    
    $scope.showDock();

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
        $scope.showDock();
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
} 