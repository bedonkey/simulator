ClearExchange()
ResetAccounts()

SetSession(HNX, NEW) # Set sesison on ORS, GW, EX is Intermission
SetSession(HOSE, NEW) # Set sesison on ORS, GW, EX is Intermission

ord1 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord1.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

ord2 = Place(0001000001, SSI, Buy, LO, 21000, 100)
Assert(ord2.status, true)
status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord2.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord2.msg)
Assert(count, 1)

SetSession(HNX, OPEN1) # Set sesison on ORS, GW, EX is Open

status = GetOrderStatus(ord1.msg)
Assert(status, New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | New)
count = CountOrderDetail(ord1.msg)
Assert(count, 2)

Assert(ord2.status, true)
status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord2.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord2.msg)
Assert(count, 1)

SetSession(HOSE, OPEN1) # Set sesison on ORS, GW, EX is Open

status = GetOrderStatus(ord1.msg)
Assert(status, New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | New)
count = CountOrderDetail(ord1.msg)
Assert(count, 2)

status = GetOrderStatus(ord2.msg)
Assert(status, New)
event = GetOrderEvent(ord2.msg)
Assert(event, Pending New | New)
count = CountOrderDetail(ord2.msg)
Assert(count, 2)
