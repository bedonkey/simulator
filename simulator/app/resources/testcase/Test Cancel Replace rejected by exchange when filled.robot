ClearExchange()
SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)

ord1 = Place(0001000001, AAA, Buy, 15000, 100)

status = GetOrderStatus(ord1.msg)
Assert(status, New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

SetGatewaySession(HNX, INTERMISSION)

status = GetOrderStatus(ord1.msg)
Assert(status, New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

ord3 = Place(0001000002, AAA, Sell, 15000, 100)
ord2 = Replace(ord1.msg, 15000, 200)

status = GetOrderStatus(ord3.msg)
Assert(status, Pending New)
count = CountOrderDetail(ord3.msg)
Assert(count, 1)

event = GetOrderEvent(ord1.msg)
Assert(event, New | Pending Replace)
count = CountOrderDetail(ord1.msg)
Assert(count, 2)

SetGatewaySession(HNX, OPEN)

status = GetOrderStatus(ord3.msg)
Assert(status, Filled)
count = CountOrderDetail(ord3.msg)
Assert(count, 2)

event = GetOrderEvent(ord1.msg)
Assert(event, New | Pending Replace | Filled | Rejected)
count = CountOrderDetail(ord1.msg)
Assert(count, 4)

ResetAccounts()