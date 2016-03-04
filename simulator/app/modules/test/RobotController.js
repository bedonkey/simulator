robottestData = {};

RobotController = function($scope, $http, logScreen, interpeter) {
	
    $scope.init = function() {
        $scope.isSave = true;
        $scope.logData = logScreen.getLogData();
        $scope.currentTest = {};
        $scope.testTitle = robottestData.testTitle;
        $scope.testPass = robottestData.testPass;
        $scope.currentTest = robottestData.currentTest;
        
        if (robottestData.lines != undefined) {
            $scope.lines = robottestData.lines;
            $("#testcase-editor .content").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
        }

        if (robottestData.testcases == undefined) {
            $http.get('app/resources/testcase/testcase.json')
            .success(function(data, status, headers, config) {
                if (data && status === 200) {
                    $scope.testcases = data;
                    robottestData.testcases = data;
                }
            });
        } else {
            $scope.testcases = robottestData.testcases;
        }
        $("#testcases .testcase").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
    }

	$scope.setSelected = function (selectedTest) {
	   $scope.testTitle = selectedTest;
       robottestData.testTitle = selectedTest;
	   $http.get('app/resources/testcase/' + selectedTest + '.robot')
        .success(function(data, status, headers, config) {
            if (data && status === 200) {
                $scope.lines = data.match(/[^\r\n]+/g);
                robottestData.lines = $scope.lines;
                $("#testcase-editor .content").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
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
            if ($scope.testPass == undefined) {
                $scope.testPass = 'true';
            }
            test.status = 'green';
        } else {
            $scope.testPass = undefined;
            test.status = '';
        }
        robottestData.testPass = $scope.testPass;
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
        $scope.testPass = undefined;
        for (var i = 0; i < $scope.testcases.length; i++) {
            $scope.testcases[i].status = '';
        }
        logScreen.init();
        $scope.currentTest = {name: $scope.testTitle, index: 0};
        robottestData.currentTest = $scope.currentTest;
        this.test($scope.currentTest, this.doTest);
    }

    $scope.runalltest = function() {
        for (var i = 0; i < $scope.testcases.length; i++) {
            this.test($scope.testcases[i], this.doTest);
        };
    }

    $scope.init();
} 