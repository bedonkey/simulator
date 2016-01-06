LearnController = function($scope, $http) {
	$scope.isSave = true;
	$scope.isClickTest = false;
	$scope.testTitle = "None Testcase selected";
    $scope.testPass = '';
    $scope.curLine = 0;
    $scope.lines = {};

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
        $scope.curLine = 0;
        $scope.isClickTest = true;
        $scope.selectedTest = selectedTest;
        $scope.testTitle = selectedTest;
        $http.get('app/resources/testcase/' + selectedTest + '.robot')
        .success(function(data, status, headers, config) {
            if (data && status === 200) {
                $scope.lines = data.match(/[^\r\n]+/g);
                $scope.explain = $scope.lines[0].split('#')[1];
            }
        });
        
	};

    $scope.nextStep = function () {
        if ($scope.curLine < $scope.lines.length) {
            $scope.curLine++;
            $scope.explain = $scope.lines[$scope.curLine].split('#')[1];
        }
    }

    $scope.prevStep = function () {
        if ($scope.curLine != 0) {
            $scope.curLine--;
            $scope.explain = $scope.lines[$scope.curLine].split('#')[1];
        }
    }

    $scope.init();
} 