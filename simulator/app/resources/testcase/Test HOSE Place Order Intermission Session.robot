ClearExchange()
ResetAccounts()

SetSession(HOSE, INTERMISSION) # Set sesison on ORS, GW, EX is Intermission

ord1 = Place(0001000001, SSI, Buy, LO, 20000, 100)
Assert(ord1.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

SetSession(HOSE, OPEN2) # Set sesison on ORS, GW, EX is Open

status = GetOrderStatus(ord1.msg)
Assert(status, New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | New)
count = CountOrderDetail(ord1.msg)
Assert(count, 2)
