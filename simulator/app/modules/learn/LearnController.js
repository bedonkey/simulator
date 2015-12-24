LearnController = function($scope, $http) {
	$scope.isSave = true;
	$scope.isClickTest = false;
	$scope.testTitle = "None Testcase selected";
    $scope.testPass = '';

    $scope.init = function() {
    	$http.get('app/resources/system-keyword.robot')
        .success(function(data, status, headers, config) {
            if (data && status === 200) {
                $scope.keywords = data;
            }
        });

        $http.get('app/resources/testcase/testcase.json')
        .success(function(data, status, headers, config) {
            if (data && status === 200) {
                $scope.testcases = data;
            }
        });
    }

	$scope.setSelected = function (selectedTest) {
	   $scope.isClickTest = true;
	   $scope.selectedTest = selectedTest;
	   $scope.testTitle = selectedTest;
	   $http.get('app/resources/testcase/' + selectedTest + '.robot')
        .success(function(data, status, headers, config) {
            if (data && status === 200) {
                $scope.lines = data;
            }
        });
	};

    $scope.init();
} 