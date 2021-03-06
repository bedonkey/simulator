DockController = function($scope, ors, dockService) {
    $scope.init = function() {
        $scope.buttonColor = 'green_button';
        $scope.orderPlace = {
            account : '0001000001',
            symbol : 'VND',
            sec: {},
            acc: {},
            side: Side.BUY,
            type: 'LO',
            price: 11000,
            qty: 100
        };
        $scope.dockInfo = dockService.initDock();
        dockService.setCurrentAcc('0001000001');
        dockService.setCurrentSym('VND');
        dockService.setCurrentSide('Buy');
        dockService.setCurrentPrice(11000);
        $scope.command = {
            key : ''
        };
    }

    $scope.commandPress = function() {
        if ($scope.command.key != '' && $scope.command.key != undefined) {
            if ($scope.command.key == 'A') {
                $scope.accountFocus = true;
                $scope.orderPlace.account = '';
                dockService.refreshAccount();
            }
            if ($scope.command.key == 'Y') {
                $scope.symbolFocus = true;
                $scope.orderPlace.symbol = '';
                dockService.refeshSymbol();
            }
            if ($scope.command.key == 'S') {
                $scope.orderPlace.side = Side.SELL;
                $scope.command.key = '';
                this.onSideChange();
            }
            if ($scope.command.key == 'B') {
                $scope.orderPlace.side = Side.BUY;
                $scope.command.key = '';
                this.onSideChange();
            }
            if ($scope.command.key == 'Q') {
                $scope.quantityFocus = true;
                $scope.orderPlace.qty = '';
            }
            if ($scope.command.key == 'P') {
                $scope.priceFocus = true;
                $scope.orderPlace.price = '';
            }
            $scope.commandFocus = false;
        }
    }

    $scope.accountInput = function() {
        $scope.command.key = '';
        $scope.accountFocus = false;
        $scope.commandFocus = true;
    }

    $scope.symbolInput = function() {
        $scope.command.key = '';
        $scope.symbolFocus = false;
        $scope.commandFocus = true;
    }

    $scope.quantityInput = function() {
        $scope.command.key = '';
        $scope.quantityFocus = false;
        $scope.commandFocus = true;
    }

    $scope.priceInput = function() {
        $scope.command.key = '';
        $scope.priceFocus = false;
        $scope.commandFocus = true;
    }

    $scope.onPriceChange = function() {
        dockService.setCurrentPrice($scope.orderPlace.price);
        dockService.updateTrade();
    }

    $scope.onSideChange = function() {
        if ($scope.orderPlace.side == Side.SELL) {
            $scope.buttonColor = 'red_button';
        } else {
            $scope.buttonColor = 'green_button';
        }
        dockService.setCurrentSide($scope.orderPlace.side);
        dockService.updateTrade();
    }

    $scope.onTypeChange = function() {
        var types = ["ATO", "ATC", "MP", "MTL", "MOK", "MAK"]
        if (types.indexOf($scope.orderPlace.type) > -1) {
            $scope.orderPlace.price = 0;
        } else {
            $scope.orderPlace.price = dockService.getRefPrice();
        }
    }

    $scope.refeshSymbol = function() {
        dockService.setCurrentSym($scope.orderPlace.symbol);
        $scope.orderPlace.price = dockService.getRefPrice();
        dockService.refeshSymbol();
    }

    $scope.refreshAccount = function() {
        dockService.setCurrentAcc($scope.orderPlace.account);
        dockService.refreshAccount();
    }

    $scope.place = function() {
        var types = ["ATO", "ATC", "MP", "MTL", "MOK", "MAK"]
        if (types.indexOf($scope.orderPlace.type) > -1) {
            $scope.orderPlace.price = 0;
        }
        var ord = Utils.clone($scope.orderPlace);
        var result = ors.place(ord);
        if (result.status == false) {
            alert(result.msg);
        } else {
            dockService.refreshAccount();
        }
    }

    $scope.init();
    dockService.refreshAccount();
    dockService.refeshSymbol();
    
} 