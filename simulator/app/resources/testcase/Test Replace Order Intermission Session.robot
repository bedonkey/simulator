ClearExchange() # Clear all order on Exchange
SetExchangeSession(HNX, OPEN2) # Set session on Exchange is Open
SetGatewaySession(HNX, OPEN2) # Set session on Gateway is Open
SetORSSession(HNX, OPEN2) # Set sesison on ORS is Open

ord0 = Place(1, AAA, Buy, 2000, 100)
Assert(ord0.status, true)
status = GetOrderStatus(ord0.msg)
Assert(status, New)
event = GetOrderEvent(ord0.msg)
Assert(event, New)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)

SetExchangeSession(HNX, INTERMISSION) # Set session on Exchange is Interminssion
SetGatewaySession(HNX, INTERMISSION) # Set session on Gateway is Interminssion
SetORSSession(HNX, INTERMISSION) # Set sesison on ORS is Interminssion

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

ord2 = Replace(ord1.msg, 2500, 200)
ord3 = Replace(ord0.msg, 2500, 200)

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

SetExchangeSession(HNX, OPEN2) # Set session on Exchange is Open
SetGatewaySession(HNX, OPEN2) # Set session on Gateway is Open
SetORSSession(HNX, OPEN2) # Set sesison on ORS is Open

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

ResetAccounts()