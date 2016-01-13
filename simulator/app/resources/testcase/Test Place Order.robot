OpenExchange() # Set session on Exchange is Open
OpenORS() # Set sesison on ORS is Open
ClearExchange() # Clear all order on Exchange
result = Place(1, AAA, Buy, 5000, 100) # Place order with account 1, Symbol AAA, Price 5000 and Quantity 100
Assert(result.msg, Price must lower than ceil price) # This order should be reject because price is 5000 and ceil price is 3000

result = Place(1, AAA, Buy, 500, 100)
Assert(result.msg, Price must larger than floor price)

result = Place(123, AAA, Buy, 2000, 100)
Assert(result.msg, Account not exist)

result = Place(1, XXX, Buy, 2000, 100)
Assert(result.msg, Symbol not exist)

result = Place(1, AAA, Buy, 2000, 100000)
Assert(result.msg, Don't enough balance)

result = Place(1, AAA, Sell, 2000, 10000)
Assert(result.msg, Don't enough trade)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

result = Cancel(ord1.msg)
Assert(result.status, true)

ResetAccounts()