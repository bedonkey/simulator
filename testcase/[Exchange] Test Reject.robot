ClearExchange()
ResetAccounts()

SetSession(HNX, NEW)

ord0 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord0.status, true)

count = CountOrderDetail(ord0.msg)
Assert(count, 1)
status = GetOrderStatus(ord0.msg)
Assert(status, Pending New)

SetORSSession(HNX, OPEN1)

count = CountOrderDetail(ord0.msg)
Assert(count, 1)
status = GetOrderStatus(ord0.msg)
Assert(status, Pending New)

SetGatewaySession(HNX, OPEN1)

count = CountOrderDetail(ord0.msg)
Assert(count, 2)
status = GetOrderStatus(ord0.msg)
Assert(status, Rejected)

SetExchangeSession(HNX, OPEN1)

ord0 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord0.status, true)

ord1 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord0.status, true)

SetExchangeSession(HNX, CLOSE)

result = Cancel(ord0.msg)
Assert(result.status, false)
Assert(result.msg, Exchange is close)

count = CountOrderDetail(ord0.msg)
Assert(count, 3)

status = GetOrderStatus(ord0.msg)
Assert(status, New)

ord2 = Replace(ord1.msg, 15500, 200)
Assert(result.status, false)
Assert(result.msg, Exchange is close)

count = CountOrderDetail(ord0.msg)
Assert(count, 3)

status = GetOrderStatus(ord1.msg)
Assert(status, New)