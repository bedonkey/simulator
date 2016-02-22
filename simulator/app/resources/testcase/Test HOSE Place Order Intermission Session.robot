ClearExchange()
ResetAccounts()

SetExchangeSession(HOSE, INTERMISSION) # Set session on Exchange is Intermission
SetGatewaySession(HOSE, INTERMISSION) # Set session on Gateway is Intermission
SetORSSession(HOSE, INTERMISSION) # Set sesison on ORS is Intermission

ord1 = Place(0001000001, SSI, Buy, 20000, 100)
Assert(ord1.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

SetExchangeSession(HOSE, OPEN2) # Set session on Exchange is Open
SetGatewaySession(HOSE, OPEN2) # Set session on Gateway is Open
SetORSSession(HOSE, OPEN2) # Set sesison on ORS is Open

status = GetOrderStatus(ord1.msg)
Assert(status, New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | New)
count = CountOrderDetail(ord1.msg)
Assert(count, 2)
