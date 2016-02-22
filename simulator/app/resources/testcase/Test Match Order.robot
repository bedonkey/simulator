ClearExchange()
ResetAccounts()

SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)

ord1 = Place(0001000003, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

ord2 = Place(0001000001, AAA, Buy, 15800, 150)
Assert(ord2.status, true)

status = GetOrderStatus(ord1.msg)
Assert(status, New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

status = GetOrderStatus(ord2.msg)
Assert(status, New)
count = CountOrderDetail(ord2.msg)
Assert(count, 1)

ord3 = Place(0001000002, AAA, Sell, 15200, 100)
Assert(ord3.status, true)

status = GetOrderStatus(ord2.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord3.msg)
Assert(count, 2)

status = GetOrderStatus(ord3.msg)
Assert(status, Filled)
count = CountOrderDetail(ord3.msg)
Assert(count, 2)
event = GetOrderEvent(ord3.msg)
Assert(event, New | Filled)

ord4 = Place(0001000002, AAA, Sell, 16000, 100)
Assert(ord4.status, true)

status = GetOrderStatus(ord4.msg)
Assert(status, New)
count = CountOrderDetail(ord4.msg)
Assert(count, 1)

ord5 = Replace(ord4.msg, 15800, 100)
Assert(ord4.status, true)

status = GetOrderStatus(ord5.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord4.msg)
Assert(count, 4)

ord6 = Replace(ord1.msg, 15900, 100)
Assert(ord6.status, true)

status = GetOrderStatus(ord5.msg)
Assert(status, Filled)
count = CountOrderDetail(ord4.msg)
Assert(count, 5)

status = GetOrderStatus(ord6.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 4)
event = GetOrderEvent(ord1.msg)
Assert(event, New | Pending Replace | Replaced | Partial Filled)

ord7 = Replace(ord6.msg, 15900, 600)
Assert(ord6.status, true)

status = GetOrderStatus(ord7.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 6)

result = Place(0001000002, AAA, Sell, 15300, 100)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, 15200, 70)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, 15500, 100)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, 15200, 100)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, 15300, 100)
Assert(result.status, true)

ord8 = Place(0001000002, AAA, Sell, 15200, 100)
Assert(ord8.status, true)

status = GetOrderStatus(ord7.msg)
Assert(status, Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 12)

status = GetOrderStatus(ord8.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord8.msg)
Assert(count, 2)

ord9 = Place(0001000001, AAA, Buy, 15800, 20)
Assert(ord9.status, true)

status = GetOrderStatus(ord8.msg)
Assert(status, Filled)
event = GetOrderEvent(ord8.msg)
Assert(event, New | Partial Filled | Filled)
count = CountOrderDetail(ord8.msg)
Assert(count, 3)

status = GetOrderStatus(ord9.msg)
Assert(status, Filled)
event = GetOrderEvent(ord9.msg)
Assert(event, New | Filled)
count = CountOrderDetail(ord9.msg)
Assert(count, 2)
