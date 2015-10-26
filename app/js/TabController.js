TabController = function($scope) {
    $scope.tabs = [
        {
            title: 'Order Book',
            url: 'orderbook.html'
        }, {
            title: 'Price Board',
            url: 'priceboard.html'
        }, {
            title: 'Exchange',
            url: 'exchange.html'
        }, {
            title: 'RobotTest',
            url: 'robot.html'
        }
    ];

    $scope.tabsSetting = [
        {
            title: 'Account',
            url: 'account.html'
        }, {
            title: 'SecInfo',
            url: 'secinfo.html'
        },{
            title: 'AfType',
            url: 'aftype.html'
        }, {
            title: 'Basket',
            url: 'basket.html'
        }
    ];

    $scope.currentTab = 'orderbook.html';

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