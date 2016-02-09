var app = angular.module("mainapp", []);
app.directive('ngEnter', EnterHandleDirective);
app.directive('ngCommand', CommandHandleDirective);
app.directive('uppercased', UppercaseDirective);
app.directive('cellChange', CellChangeDirective);
app.directive('focusMe', FocusMeDirective);
app.directive('autofocus', AutoFocusDirective);
app.directive('blink', BlinkDirective);

app.service('accountValidator', AccountValidator);
app.service('account', ['accountValidator', 'aftype', Account]);
app.service('aftype', ['basket', AfType]);
app.service('basket', Basket);
app.service('orderValidator', ['account', 'secinfo', 'aftype', 'sessionManager', OrderValidator]);
app.service('order', ['orderValidator', 'aftype', 'orderStore', 'account', 'priceBoard', 'gateway', 'sessionManager', Order]);
app.service('secInfoValidator', SecInfoValidator);
app.service('secinfo', ['secInfoValidator', SecInfo]);
app.service('exSecinfo', ExSecInfo);
app.service('priceBoard', ['secinfo', PriceBoard]);
app.service('orderStore', OrderStore);
app.service('dockService', ['account', 'secinfo', DockService]);
app.service('logScreen', LogScreen);
app.service('interpreter', ['logScreen', 'order', 'account', 'ors', 'gateway',  'exchange', Interpreter]);
app.service('exchangeValidator', ['exSecinfo', ExchangeValidator]);
app.service('gateway', ['orderStore', 'exchange', 'sessionManager', Gateway]);
app.service('exchange', ['exchangeValidator', 'account', 'orderStore', 'priceBoard', 'sessionManager', Exchange]);
app.service('sessionManager', ['dockService', SessionManager]);
app.service('ors', ['order', 'sessionManager', ORS]);

app.controller("TabsCtrl", ['$scope', '$window', TabController]);
app.controller('GatewayController', ['$scope', 'orderStore', GatewayController]);
app.controller('ExchangeController', ['$scope', 'orderStore', ExchangeController]);
app.controller("SecInfoController", ['$scope', 'secinfo', SecInfoController]);
app.controller("ExSecInfoController", ['$scope', 'exSecinfo', ExSecInfoController]);
app.controller("AccountController", ['$scope', 'account', 'aftype', AccountController]);
app.controller("AfTypeController", ['$scope', 'aftype', 'basket', AfTypeController]);
app.controller("BasketController", ['$scope', 'basket', BasketController]);
app.controller("OrderBookController", ['$scope', 'order', 'orderStore', 'dockService', OrderBookController]);
app.controller("PriceBoardController", ['$scope', 'priceBoard', PriceBoardController]);
app.controller("DockController", ['$scope', 'order', 'dockService', DockController]);
app.controller("RobotController", ['$scope', '$http', 'logScreen', 'interpreter', RobotController]);
app.controller("LearnController", ['$scope', '$http', LearnController]);
app.controller("MonitorController", ['$scope','order', 'ors', 'gateway', 'exchange', MonitorController]);

app.directive("orderDetail", function(){return {templateUrl:'app/modules/home/orderbook/detail.html'};});
app.directive("orderReplace", function(){return {templateUrl:'app/modules/home/orderbook/replace.html'};});
app.directive("accountAdd", function(){return {templateUrl:'app/modules/ors/account/add.html'};});
app.directive("secinfoAdd", function(){return {templateUrl:'app/modules/ors/secinfo/add.html'};});
app.directive("exSecinfoAdd", function(){return {templateUrl:'app/modules/exchange/secinfo/add.html'};});
app.directive("aftypeAdd", function(){return {templateUrl:'app/modules/ors/aftype/add.html'};});
app.directive("basketAdd", function(){return {templateUrl:'app/modules/ors/basket/add.html'};});
app.directive("mask", function(){return {templateUrl:'app/shared/mask.html'};});

app.filter('split', function() {return function(input, splitChar, splitIndex) {return input.split(splitChar)[splitIndex];}});