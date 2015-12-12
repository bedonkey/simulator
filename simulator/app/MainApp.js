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
app.service('orderValidator', ['account', 'secinfo', 'aftype', OrderValidator]);
app.service('order', ['orderValidator', 'aftype', 'orderStore', 'matcher', 'account', 'priceBoard', 'exchange', Order]);
app.service('secInfoValidator', SecInfoValidator);
app.service('secinfo', ['secInfoValidator', SecInfo]);
app.service('priceBoard', ['secinfo', PriceBoard]);
app.service('matcher', ['account', 'orderStore', 'priceBoard', Matcher]);
app.service('orderStore', OrderStore);
app.service('dockService', ['account', 'secinfo', DockService]);
app.service('logScreen', LogScreen);
app.service('interpreter', ['logScreen', 'order', 'account', 'exchange', Interpreter]);
app.service('exchange', ['dockService', Exchange]);

app.controller("TabsCtrl", ['$scope', TabController]);
app.controller('ExchangeController', ['$scope', 'matcher', 'exchange', ExchangeController]);
app.controller("SecInfoController", ['$scope', 'secinfo', SecInfoController]);
app.controller("AccountController", ['$scope', 'account', 'aftype', AccountController]);
app.controller("AfTypeController", ['$scope', 'aftype', 'basket', AfTypeController]);
app.controller("BasketController", ['$scope', 'basket', BasketController]);
app.controller("OrderBookController", ['$scope', 'order', 'orderStore', 'dockService', OrderBookController]);
app.controller("PriceBoardController", ['$scope', 'priceBoard', PriceBoardController]);
app.controller("DockController", ['$scope', 'order', 'dockService', DockController]);
app.controller("RobotController", ['$scope', '$http', 'logScreen', 'interpreter', RobotController]);

app.directive("orderDetail", function(){return {templateUrl:'app/components/orderbook/detail.html'};});
app.directive("orderReplace", function(){return {templateUrl:'app/components/orderbook/replace.html'};});
app.directive("accountAdd", function(){return {templateUrl:'app/components/account/add.html'};});
app.directive("secinfoAdd", function(){return {templateUrl:'app/components/secinfo/add.html'};});
app.directive("aftypeAdd", function(){return {templateUrl:'app/components/aftype/add.html'};});
app.directive("basketAdd", function(){return {templateUrl:'app/components/basket/add.html'};});
app.directive("mask", function(){return {templateUrl:'app/shared/mask.html'};});