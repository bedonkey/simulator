SetExchangeSession(HNX, OPEN1) # Set session on Exchange is Open
SetGatewaySession(HNX, OPEN1) # Set session on Gateway is Open
SetORSSession(HNX, OPEN1) # Set sesison on ORS is Open
ClearExchange() # Clear all order on Exchange

ord0 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord0.status, true)

status = GetOrderStatus(ord0.msg)
Assert(status, New)
event = GetOrderEvent(ord0.msg)
Assert(event, New)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)

SetExchangeSession(HNX, INTERMISSION) # Set session on Exchange is Open
SetGatewaySession(HNX, INTERMISSION) # Set session on Gateway is Open
SetORSSession(HNX, INTERMISSION) # Set sesison on ORS is Open

ord1 = Place(0001000001, VND, Buy, 11000, 100)
Assert(ord1.status, true)

status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

result1 = Cancel(ord1.msg)
result0 = Cancel(ord0.msg)

Assert(result1.status, true)
Assert(result0.status, true)

status = GetOrderStatus(ord1.msg)
Assert(status, Canceled)
event = GetOrderEvent(ord1.msg)
Assert(event, Pending New | Pending Cancel | Canceled)
count = CountOrderDetail(ord1.msg)
Assert(count, 3)

status = GetOrderStatus(ord0.msg)
Assert(status, Pending Cancel)
event = GetOrderEvent(ord0.msg)
Assert(event, New | Pending Cancel)
count = CountOrderDetail(ord0.msg)
Assert(count, 2)

SetExchangeSession(HNX, OPEN2) # Set session on Exchange is Open
SetGatewaySession(HNX, OPEN2) # Set session on Gateway is Open
SetORSSession(HNX, OPEN2) # Set sesison on ORS is Open

status = GetOrderStatus(ord0.msg)
Assert(status, Canceled)
event = GetOrderEvent(ord0.msg)
Assert(event, New | Pending Cancel | Canceled)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)

ResetAccounts()