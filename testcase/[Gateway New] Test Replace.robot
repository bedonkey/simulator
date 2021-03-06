ClearExchange()
ResetAccounts()

SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, NEW)
SetORSSession(HNX, OPEN1)

ord0 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord0.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)
status = GetOrderStatus(ord0.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord0.msg)
Assert(event, Pending New)

ord1 = Replace(ord0.msg, 15500, 200)
Assert(ord1.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord0.msg)
Assert(event, Pending New | Pending Replace | Replaced)

ord2 = Replace(ord1.msg, 15200, 300)
Assert(ord2.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 5)
status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord0.msg)
Assert(event, Pending New | Pending Replace | Replaced | Pending Replace | Replaced)

result = Cancel(ord2.msg)
Assert(result.status, false)
count = CountOrderDetail(ord0.msg)
Assert(count, 7)
status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord0.msg)
Assert(event, Pending New | Pending Replace | Replaced | Pending Replace | Replaced | Pending Cancel | Rejected)
