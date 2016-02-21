SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)

ord1 = Place(1, AAA, Buy, 2000, 100)

status = GetOrderStatus(ord1.msg)
Assert(status, New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

SetGatewaySession(HNX, NEW)

status = GetOrderStatus(ord1.msg)
Assert(status, New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

ord3 = Place(2, AAA, Sell, 2000, 100)
ord2 = Replace(ord1.msg, 2000, 200)

status = GetOrderStatus(ord3.msg)
Assert(status, Pending New)
count = CountOrderDetail(ord3.msg)
Assert(count, 1)

event = GetOrderEvent(ord1.msg)
Assert(event, New | Pending Replace)
count = CountOrderDetail(ord1.msg)
Assert(count, 2)

SetGatewaySession(HNX, OPEN)

ResetAccounts()