OpenExchange() # Set session on Exchange is Open
OpenGateway() # Set session on Gateway is Open
OpenORS() # Set sesison on ORS is Open
ClearExchange() # Clear all order on Exchange

result = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(result.status, true)

status = GetOrderStatus(result.msg)
Assert(status, New)

result1 = Cancel(result.msg)
Assert(result1.status, true)

status = GetOrderStatus(result.msg)
Assert(status, Canceled)

result = Place(1, AAA, Buy, 2000, 100)
Assert(result.status, true)

result = Replace(result.msg, 2500, 200)
Assert(result.status, true)

status = GetOrderStatus(result.msg)
Assert(status, New)

result = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(result.status, true)

Unhold(result.msg);

status = GetOrderStatus(result.msg)
Assert(status, Done For Day)

ResetAccounts()