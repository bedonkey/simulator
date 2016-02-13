OpenExchange() # Set session on Exchange is Open
OpenGateway() # Set session on Gateway is Open
OpenORS() # Set sesison on ORS is Open
ClearExchange() # Clear all order on Exchange

ord1 = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(ord1.status, true)

status = GetOrderStatus(ord1.msg)
Assert(status, New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

result = Cancel(ord1.msg)
Assert(result.status, true)

status = GetOrderStatus(ord1.msg)
Assert(status, Canceled)
count = CountOrderDetail(ord1.msg)
Assert(count, 3)

ord2 = Place(1, AAA, Buy, 2000, 100)
Assert(ord2.status, true)

ord3 = Replace(ord2.msg, 2500, 200)
Assert(ord3.status, true)

status = GetOrderStatus(ord3.msg)
Assert(status, New)
count = CountOrderDetail(ord2.msg)
Assert(count, 3)

ord4 = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(ord4.status, true)

Unhold(ord4.msg);

status = GetOrderStatus(ord4.msg)
Assert(status, Done For Day)
count = CountOrderDetail(ord4.msg)
Assert(count, 2)

ResetAccounts()