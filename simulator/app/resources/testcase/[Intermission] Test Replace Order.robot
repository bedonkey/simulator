ClearExchange()
ResetAccounts()

SetSession(HNX, OPEN1) # Set sesison on ORS, GW, Ex is Open

ord0 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord0.status, true)
status = GetOrderStatus(ord0.msg)
Assert(status, New)
event = GetOrderEvent(ord0.msg)
Assert(event, New)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)

SetSession(HNX, INTERMISSION) # Set sesison on ORS, GW, EX is Interminssion

ord1 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord1.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

ord2 = Replace(ord1.msg, 15500, 200)
ord3 = Replace(ord0.msg, 15500, 200)

status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | Pending Replace | Replaced)
count = CountOrderDetail(ord1.msg)
Assert(count, 3)

status = GetOrderStatus(ord3.msg)
Assert(status, Pending Replace)
event = GetOrderEvent(ord0.msg)
Assert(event, New | Pending Replace)
count = CountOrderDetail(ord0.msg)
Assert(count, 2)

SetSession(HNX, OPEN2) # Set sesison on ORS, GW, EX is Open

status = GetOrderStatus(ord2.msg)
Assert(status, New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | Pending Replace | Replaced | New)
count = CountOrderDetail(ord1.msg)
Assert(count, 4)

status = GetOrderStatus(ord3.msg)
Assert(status, New)
event = GetOrderEvent(ord0.msg)
Assert(event, New | Pending Replace | Replaced)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)
