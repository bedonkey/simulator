AccountController = function($scope, account, aftype) {
    $scope.accounts = account.getAll();
    $scope.aftypes = aftype.getAll();
    $scope.search = {
        account : ''
    };

    $scope.add = function() {
        var error = account.add($scope.accountDetail);
        if (error != "") {
            $scope.accAddError = error;
        } else {
            $scope.isAddBox = false;
        }
    }

    $scope.remove = function(acc) {
        account.delete(acc);
        $scope.accounts = account.get($scope.search.account);
    }

    $scope.addSec = function() {
        if($scope.accountDetail.secs == undefined) {
            $scope.accountDetail.secs = [];
        }
        var sec = {};
        $scope.accountDetail.secs.push(sec);
    }

    $scope.removeSec = function(sec) {
        for (var i = 0; i < $scope.accountDetail.secs.length; i++) {
            if (sec.symbol == $scope.accountDetail.secs[i].symbol) {
                $scope.accountDetail.secs.splice(i, 1);
            }
        };
    }

    $scope.openAddBox = function() {
        $scope.isAddBox = true;
        $scope.accountDetail = {};
        $scope.accAddError = "";
    }

    $scope.openEditBox = function(account) {
        $scope.mask=true;
        $scope.popupOpen=true;
        $scope.accountDetail = account;
    }

    $scope.onChangeService = function(acc) {
        account.refresh(acc);
    }

    $scope.onChangeAfType = function(acc) {
        account.refresh(acc);
    }
} 