SetExchangeSession(HNX, INTERMISSION) # Set session on Exchange is Open
SetGatewaySession(HNX, INTERMISSION) # Set session on Gateway is Open
SetORSSession(HNX, INTERMISSION) # Set sesison on ORS is Open
ClearExchange() # Clear all order on Exchange

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

ord2 = Replace(ord1.msg, 2500, 200)

status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | Pending replace | Replaced)
count = CountOrderDetail(ord1.msg)
Assert(count, 3)

SetExchangeSession(HNX, OPEN2) # Set session on Exchange is Open
SetGatewaySession(HNX, OPEN2) # Set session on Gateway is Open
SetORSSession(HNX, OPEN2) # Set sesison on ORS is Open

status = GetOrderStatus(ord1.msg)
Assert(status, Replaced)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | Pending replace | Replaced)
count = CountOrderDetail(ord1.msg)
Assert(count, 3)

ResetAccounts()