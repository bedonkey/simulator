ClearExchange() # Clear all order on Exchange
SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, NEW)
SetORSSession(HNX, NEW)

ord1 = Place(0001000001, AAA, Buy, 15000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(ord1.status, true)

ord2 = Place(0001000001, AAA, Buy, 15000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(ord2.status, true)

ord3 = Place(0001000002, AAA, Sell, 15000, 100) # Place order with account 2, Symbol AAA, Price 2000 and Quantity 100
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

SetGatewaySession(HNX, OPEN)

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

SetORSSession(HNX, OPEN)

status = GetOrderStatus(ord2.msg)
Assert(status, New)
count = CountOrderDetail(ord2.msg)
Assert(count, 2)
event = GetOrderEvent(ord2.msg)
Assert(event, Pending New | New)

status = GetOrderStatus(ord1.msg)
Assert(status, Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 3)

status = GetOrderStatus(ord3.msg)
Assert(status, Filled)
count = CountOrderDetail(ord3.msg)
Assert(count, 2)

ord4 = Place(0001000001, AAA, Buy, 15000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(ord4.status, true)

status = GetOrderStatus(ord4.msg)
Assert(status, New)
count = CountOrderDetail(ord4.msg)
Assert(count, 1)
event = GetOrderEvent(ord4.msg)
Assert(event, New)

ResetAccounts()