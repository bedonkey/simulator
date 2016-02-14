ClearExchange() # Clear all order on Exchange
SetExchangeSession(OPEN)
SetGatewaySession(NEW)
SetORSSession(NEW)

ord1 = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(ord1.status, true)

ord2 = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(ord2.status, true)

ord3 = Place(2, AAA, Sell, 2000, 100) # Place order with account 2, Symbol AAA, Price 2000 and Quantity 100
Assert(ord3.status, true)

status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)
count = CountOrderDetail(ord2.msg)
Assert(count, 1)

status = GetOrderStatus(ord3.msg)
Assert(status, Pending New)
count = CountOrderDetail(ord3.msg)
Assert(count, 1)

OpenORS() # Set sesison on ORS is Open

status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)
count = CountOrderDetail(ord2.msg)
Assert(count, 1)

status = GetOrderStatus(ord3.msg)
Assert(status, Pending New)
count = CountOrderDetail(ord3.msg)
Assert(count, 1)

OpenGateway() # Set session on Gateway is Open

status = GetOrderStatus(ord1.msg)
Assert(status, Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 3)

status = GetOrderStatus(ord2.msg)
Assert(status, New)
count = CountOrderDetail(ord2.msg)
Assert(count, 2)
event = GetOrderEvent(ord2.msg)
Assert(event, Pending New | New)

status = GetOrderStatus(ord3.msg)
Assert(status, Filled)
count = CountOrderDetail(ord3.msg)
Assert(count, 2)

ord4 = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(ord4.status, true)

status = GetOrderStatus(ord4.msg)
Assert(status, New)
count = CountOrderDetail(ord4.msg)
Assert(count, 1)
event = GetOrderEvent(ord4.msg)
Assert(event, New)

ResetAccounts()