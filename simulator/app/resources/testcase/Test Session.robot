OpenExchange() # Set session on Exchange is Open
OpenGateway() # Set session on Gateway is Open
OpenORS() # Set sesison on ORS is Open
ClearExchange() # Clear all order on Exchange
result = Place(1, AAA, Buy, 5000, 100) # Place order with account 1, Symbol AAA, Price 5000 and Quantity 100
Assert(result.msg, Price must lower than ceil price) # This order should be reject because price is 5000 and ceil price is 3000



ResetAccounts()