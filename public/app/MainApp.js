var app = angular.module("mainapp", []);
app.directive('ngEnter', EnterHandleDirective);
app.directive('ngCommand', CommandHandleDirective);
app.directive('uppercased', UppercaseDirective);
app.directive('cellChange', CellChangeDirective);
app.directive('focusMe', FocusMeDirective);
app.directive('autofocus', AutoFocusDirective);
app.directive('blink', BlinkDirective);
app.directive('darthFader', DarthFaderDirective);

app.service('broadcastService', ['$rootScope', BroadcastService]);
app.service('accountValidator', AccountValidator);
app.service('account', ['accountValidator', 'aftype', Account]);
app.service('aftype', ['basket', AfType]);
app.service('basket', Basket);
app.service('orderValidator', ['account', 'secinfo', 'aftype', 'sessionManager', OrderValidator]);
app.service('ors', ['broadcastService', 'orderValidator', 'aftype', 'orderStore', 'account', 'secinfo', 'gateway', 'sessionManager', ORS]);
app.service('secInfoValidator', SecInfoValidator);
app.service('secinfo', ['secInfoValidator', SecInfo]);
app.service('exSecinfo', ExSecInfo);
app.service('priceBoard', ['secinfo', PriceBoard]);
app.service('orderStore', OrderStore);
app.service('testCaseTranslator', TestCaseTranslator);
app.service('dockService', ['account', 'secinfo', DockService]);
app.service('logScreen', LogScreen);
app.service('interpreter', ['logScreen', 'account', 'ors', 'gateway',  'exchange', Interpreter]);
app.service('exchangeValidator', ['exSecinfo', ExchangeValidator]);
app.service('gateway', ['broadcastService', 'orderStore', 'exchange', 'sessionManager', Gateway]);
app.service('exchange', ['broadcastService', 'exchangeValidator', 'account', 'secinfo', 'orderStore', 'priceBoard', 'sessionManager', Exchange]);
app.service('sessionManager', ['dockService', SessionManager]);

app.controller("TabsCtrl", ['$scope', TabController]);
app.controller('GatewayController', ['$scope', 'orderStore', GatewayController]);
app.controller('ExchangeController', ['$scope', 'orderStore', ExchangeController]);
app.controller("SecInfoController", ['$scope', 'secinfo', SecInfoController]);
app.controller("ExSecInfoController", ['$scope', 'exSecinfo', ExSecInfoController]);
app.controller("AccountController", ['$scope', 'account', 'aftype', AccountController]);
app.controller("AfTypeController", ['$scope', 'aftype', 'basket', AfTypeController]);
app.controller("BasketController", ['$scope', 'basket', BasketController]);
app.controller("OrderBookController", ['$scope', 'ors', 'orderStore', 'dockService', OrderBookController]);
app.controller("PriceBoardController", ['$scope', 'priceBoard', 'ors', 'dockService', PriceBoardController]);
app.controller("DockController", ['$scope', 'ors', 'dockService', DockController]);
app.controller("RobotController", ['$scope', '$http', 'logScreen', 'interpreter', RobotController]);
app.controller("LearnController", ['$scope', '$http', 'interpreter', LearnController]);
app.controller("MonitorController", ['$scope', 'ors', 'gateway', 'exchange', MonitorController]);
app.controller("LessonController", ['$scope', '$http', 'interpreter', 'dockService', 'orderStore', 'testCaseTranslator', LessonController]);

app.directive("orderDetail", function(){return {templateUrl:'app/modules/home/orderbook/detail.html'};});
app.directive("orderReplace", function(){return {templateUrl:'app/modules/home/orderbook/replace.html'};});
app.directive("accountAdd", function(){return {templateUrl:'app/modules/ors/account/add.html'};});
app.directive("secinfoAdd", function(){return {templateUrl:'app/modules/ors/secinfo/add.html'};});
app.directive("exSecinfoAdd", function(){return {templateUrl:'app/modules/exchange/secinfo/add.html'};});
app.directive("aftypeAdd", function(){return {templateUrl:'app/modules/ors/aftype/add.html'};});
app.directive("basketAdd", function(){return {templateUrl:'app/modules/ors/basket/add.html'};});
app.directive("mask", function(){return {templateUrl:'app/shared/mask.html'};});

app.filter('split', function() {return function(input, splitChar, splitIndex) {return input.split(splitChar)[splitIndex];}});
app.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
app.directive('compileTemplate', function($compile, $parse){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() { return (parsed(scope) || '').toString(); }

            //Recompile if the template changes
            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }
})
app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
