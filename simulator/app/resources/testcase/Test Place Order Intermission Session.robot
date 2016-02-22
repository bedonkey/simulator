SetExchangeSession(HNX, INTERMISSION) # Set session on Exchange is Intermission
SetGatewaySession(HNX, INTERMISSION) # Set session on Gateway is Intermission
SetORSSession(HNX, INTERMISSION) # Set sesison on ORS is Intermission
ClearExchange() # Clear all order on Exchange

ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

SetExchangeSession(HNX, OPEN2) # Set session on Exchange is Open
SetGatewaySession(HNX, OPEN2) # Set session on Gateway is Open
SetORSSession(HNX, OPEN2) # Set sesison on ORS is Open

status = GetOrderStatus(ord1.msg)
Assert(status, New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | New)
count = CountOrderDetail(ord1.msg)
Assert(count, 2)
ResetAccounts()