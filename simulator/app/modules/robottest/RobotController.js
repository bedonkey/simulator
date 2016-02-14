RobotController = function($scope, $http, logScreen, interpeter) {
	$scope.isSave = true;
	$scope.isClickTest = false;
	$scope.testTitle = "None Testcase selected";
    $scope.testPass = '';
    $scope.logData = logScreen.getLogData();
    $scope.currentTest = {};

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
                $("#testcases .testcase").niceScroll({cursorborder:"",cursorcolor:"#ddd",boxzoom:false});
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
                $scope.lines = data.match(/[^\r\n]+/g);
                $("#testcase-editor .content").niceScroll({cursorborder:"",cursorcolor:"#ddd",boxzoom:false});
            }
        });
	};

	$scope.save = function() {
		$scope.isSave = true;
	}

	$scope.editTestcase = function() {
		$scope.isSave = false;
	}

    $scope.doTest = function(test) {
        logScreen.append("Start " + test.name);
        var result = interpeter.runTest(test);
        logScreen.append("End " + test.name);
        logScreen.append("========================");
        if (result == false) {
            $scope.testPass = 'false';
            test.status = 'red';
        } else if (result == true) {
            if ($scope.testPass == '') {
                $scope.testPass = 'true';
            }
            test.status = 'green';
        } else {
            $scope.testPass = '';
            test.status = '';
        }
    }

    $scope.test = function(test, doTest) {
        $http.get('app/resources/testcase/' + test.name + '.robot')
        .success(function(data, status, headers, config) {
            if (data && status === 200) {
                test.content = data;
                doTest(test);
            }
        });
    }

    $scope.runtest = function() {
        logScreen.init();
        var count = 0;
        for (var i = 0; i < $scope.testcases.length; i++) {
            $scope.testcases[i].status = '';
            if ($scope.testcases[i].chose) {
                this.test($scope.testcases[i], this.doTest);
                count ++;
            }
        };
        if (count == 0) {
            this.runalltest();
        }
    }

    $scope.runThisTest = function() {
        logScreen.init();
        console.log($scope.selectedTest);
        $scope.currentTest = {name: $scope.selectedTest, index: 0};
        this.test($scope.currentTest, this.doTest);
    }

    $scope.runalltest = function() {
        for (var i = 0; i < $scope.testcases.length; i++) {
            this.test($scope.testcases[i], this.doTest);
        };
    },

    $scope.init();
} 