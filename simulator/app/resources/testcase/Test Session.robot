ClearExchange() # Clear all order on Exchange
SetExchangeSession(OPEN)
SetGatewaySession(NEW)
SetORSSession(NEW)

result = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(result.status, true)

result1 = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(result1.status, true)

result2 = Place(2, AAA, Sell, 2000, 100) # Place order with account 2, Symbol AAA, Price 2000 and Quantity 100
Assert(result1.status, true)

status = GetOrderStatus(result.msg)
Assert(status, Pending New)

status = GetOrderStatus(result1.msg)
Assert(status, Pending New)

status = GetOrderStatus(result2.msg)
Assert(status, Pending New)

OpenORS() # Set sesison on ORS is Open

status = GetOrderStatus(result.msg)
Assert(status, Pending New)

status = GetOrderStatus(result1.msg)
Assert(status, Pending New)

status = GetOrderStatus(result2.msg)
Assert(status, Pending New)

OpenGateway() # Set session on Gateway is Open

status = GetOrderStatus(result.msg)
Assert(status, Filled)

status = GetOrderStatus(result1.msg)
Assert(status, New)

status = GetOrderStatus(result2.msg)
Assert(status, Filled)

result = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(result.status, true)

status = GetOrderStatus(result.msg)
Assert(status, New)

ResetAccounts()