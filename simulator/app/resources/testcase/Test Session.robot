ClearExchange() # Clear all order on Exchange
SetExchangeSession(OPEN)
SetGatewaySession(NEW)
SetORSSession(NEW)

result = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(result.status, true)

status = GetOrderStatus(result.msg)
Assert(status, Pending New)

OpenGateway() # Set session on Gateway is Open
OpenORS() # Set sesison on ORS is Open

status = GetOrderStatus(result.msg)
Assert(status, New)

result = Place(1, AAA, Buy, 2000, 100) # Place order with account 1, Symbol AAA, Price 2000 and Quantity 100
Assert(result.status, true)

status = GetOrderStatus(result.msg)
Assert(status, New)

ResetAccounts()