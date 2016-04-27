learnData = {};
LearnController = function($scope, $http, interprester) {
	$scope.isSave = true;
	$scope.isClickTest = false;
	$scope.testTitle = learnData.testTitle == undefined ? "None Testcase selected" : learnData.testTitle;
    $scope.testPass = '';
    $scope.curLine = learnData.curLine == undefined ? 0 : learnData.curLine;
    $scope.lines = {};
    $scope.testcases = [];
    learnData.testcases = [];

    $scope.init = function() {
        if (learnData.lines != undefined) {
            $scope.lines = learnData.lines;
            $("#learn-box .content").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
        }

        $http.get('api/testcases')
        .success(function(data, status) {
            if (data && status === 200) {
                for (var i = 0; i < data.length; i++) {
                    $scope.testcases.push({"name": data[i].replace('.robot','')});
                    learnData.testcases.push({"name": data[i].replace('.robot','')});
                };
                $("#testcases .testcase").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
            }
        });
    }

	$scope.setSelected = function (selectedTest) {
        $scope.curLine = 0;
        learnData.curLine = 0;
        $scope.isClickTest = true;
        $scope.selectedTest = selectedTest;
        $scope.testTitle = selectedTest;
        learnData.testTitle = selectedTest;
        $http.get('api/testcase?name=' + selectedTest.replace(/ /g,'-'))
        .success(function(data, status) {
            if (data && status === 200) {
                $scope.lines = data.match(/[^\r\n]+/g);
                learnData.lines = $scope.lines;
                $scope.explain = $scope.lines[0].split('#')[1];
                $("#learn-box .content").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
            }
        });
        
	};

    $scope.nextStep = function () {
        if ($scope.curLine < $scope.lines.length) {
            interprester.runLine($scope.lines[$scope.curLine].split('#')[0]);
            $scope.curLine++;
            $scope.explain = $scope.lines[$scope.curLine].split('#')[1];
            learnData.curLine = $scope.curLine;
        }
    }

    $scope.prevStep = function () {
        if ($scope.curLine != 0) {
            $scope.curLine--;
            $scope.explain = $scope.lines[$scope.curLine].split('#')[1];
            learnData.curLine = $scope.curLine;
        }
    }

    $scope.init();
} 