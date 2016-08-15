learnData = {};
LessonController = function($scope, $http, interprester, dockService, orderStore) {
	$scope.isSave = true;
	$scope.isClickTest = false;
	$scope.testTitle = learnData.testTitle == undefined ? "None Testcase selected" : learnData.testTitle;
    $scope.testPass = '';
    $scope.curLine = learnData.curLine == undefined ? 0 : learnData.curLine;
    $scope.lines = {};
    $scope.lessonBasic = [];
    learnData.lessonBasic = [];
    $scope.lessonAdvance = [];
    learnData.lessonAdvance = [];
    $scope.dockInfo = dockService.initDock();
    $scope.isShowOrder = false;
    $scope.isShowFinance = false;
    $scope.lessonType = 'orders';
    $scope.lessonLevel = 'basic';

    $scope.init = function() {
        $scope.orders = orderStore.getAll();
        if (learnData.lines != undefined) {
            $scope.lines = learnData.lines;
            $("#learn-box .content").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
        }
    }

	$scope.setSelected = function (selectedTest, lessonLevel) {
        $scope.curLine = 0;
        learnData.curLine = 0;
        $scope.isClickTest = true;
        $scope.selectedTest = selectedTest;
        $scope.testTitle = selectedTest;
        learnData.testTitle = selectedTest;
        $scope.lessonLevel = lessonLevel;
        $http.get('api/lesson?name=' + selectedTest.replace(/ /g,'-') +'&type=' + $scope.lessonType + '&level=' +$scope.lessonLevel)
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

    $scope.showLessonOrder = function () {
        $scope.lessonType = 'orders';
        $scope.isShowFinance = false;
        $scope.isShowOrder = true;
    }

    $scope.showLessonFinance = function () {
        $scope.lessonType = 'finance';
        $scope.isShowOrder = false;
        $scope.isShowFinance = true;
    }

    $scope.getLesson = function (level, lessonType) {
        $http.get('api/lessons?level=' + level + '&type='+lessonType)
        .success(function(data, status) {
            console.log(data);
            if (data && status === 200) {
                if (level == 'basic') {
                    for (var i = 0; i < data.length; i++) {
                        $scope.lessonBasic.push({"name": data[i].replace('.robot','')});
                        learnData.lessonBasic.push({"name": data[i].replace('.robot','')});
                    };
                    $("#testcases .testcase").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
                } else if (level = 'advance') {
                    for (var i = 0; i < data.length; i++) {
                        $scope.lessonAdvance.push({"name": data[i].replace('.robot','')});
                        learnData.lessonAdvance.push({"name": data[i].replace('.robot','')});
                    };
                    $("#testcases .testcase").niceScroll({cursorborder:"", cursorcolor:"#ddd", boxzoom:false});
                }
            }
        });
    }

    $scope.clearLesson = function (level) {
        if (level == 'basic') {
            $scope.lessonBasic = [];
        } else if (level == 'advance') {
            $scope.lessonAdvance = [];
        }
    }

    $scope.init();
} 