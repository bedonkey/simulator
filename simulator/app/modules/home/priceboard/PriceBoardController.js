PriceBoardController = function($scope, priceBoard, ors, dockService) {
    $scope.dataLoaded = false;
    $scope.buttonColor = 'green_button';
    $scope.sellIcon = 'glyphicon-unchecked';
    $scope.buyIcon = 'glyphicon-ok-circle';
    $scope.orderPlace = {
        account: '0001000001',
        symbol: 'VND',
        price: '11000',
        qty: 100,
        side: Side.BUY,
        type: 'LO'
    }

    $scope.init = function() {
        $scope.board = priceBoard.getAll();
        setTimeout(function(){ $scope.dataLoaded = true }, 500);
    }

    $scope.updateColor = function(price, row) {
        if(price != undefined) {
            if (price == row.floor) {
                return 'floor';
            }
            if(row.floor < price && price < row.ref) {
                return 'red';
            }
            if (price == row.ref) {
                return 'yellow';
            }
            if(row.ref < price && price < row.ceil) {
                return 'green';
            }
            if (price == row.ceil) {
                return 'ceil';
            }
        }
    }

    $scope.openTradeMenu = function() {
        if ($scope.placeBoxShow) {
            $scope.placeBoxShow = false;
        } else {
            $scope.placeBoxShow = true;
        }
    }

    $scope.sellClick = function() {
        $scope.sellIcon = 'glyphicon-ok-circle';
        $scope.buyIcon = 'glyphicon-unchecked';
        $scope.buttonColor = 'red_button';
    }

    $scope.buyClick = function() {
        $scope.sellIcon = 'glyphicon-unchecked';
        $scope.buyIcon = 'glyphicon-ok-circle';
        $scope.buttonColor = 'green_button';
    }

    $scope.place = function() {
        var ord = Utils.clone($scope.orderPlace);
        var result = ors.place(ord);
        if (result.status == false) {
            alert(result.msg);
        } else {
            dockService.refreshAccount();
        }
    }

    $scope.init();
} 