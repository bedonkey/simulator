ExSecInfoController = function($scope, secinfo) {
    $scope.search = {
        symbol : ''
    };
    $scope.secs = secinfo.getAll();

    $scope.openEditBox = function(sec) {
        $scope.mask=true;
        $scope.popupOpen=true;
        $scope.secDetail = sec;
    }

    $scope.closeEditBox = function() {
        $scope.isAddBox = false;
    }

    $scope.openAddBox = function() {
        $scope.isAddBox = true;
        $scope.secDetail = {};
        $scope.secAddError = "";
    }

    $scope.add = function() {
        var result = secinfo.add($scope.secDetail);
        if(result != undefined) {
            $scope.secAddError = result;
        } else {
            $scope.mask = false;
            $scope.popupOpen = false;
        }
    }

    $scope.remove = function(sec) {
        secinfo.delete(sec.symbol);
        $scope.secs = secinfo.get($scope.search.symbol);
    }
} 