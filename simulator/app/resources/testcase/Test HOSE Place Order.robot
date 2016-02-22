ClearExchange()
ResetAccounts()

SetExchangeSession(HOSE, OPEN1) # Set session on Exchange is Open
SetGatewaySession(HOSE, OPEN1) # Set session on Gateway is Open
SetORSSession(HOSE, OPEN1) # Set sesison on ORS is Open

result = Place(0001000001, SSI, Buy, 50000, 100) # Place order with account 1, Symbol AAA, Price 50000 and Quantity 100
Assert(result.msg, Price must lower than ceil price) # This order should be reject because price is 50000 and ceil price is 16000

result = Place(0001000001, SSI, Buy, 5000, 100)
Assert(result.msg, Price must larger than floor price)

result = Place(000100000123, SSI, Buy, 20000, 100)
Assert(result.msg, Account not exist)

result = Place(0001000001, XXX, Buy, 20000, 100)
Assert(result.msg, Symbol not exist)

result = Place(0001000001, SSI, Buy, 20000, 100000)
Assert(result.msg, Don't enough balance)

result = Place(0001000001, SSI, Sell, 20000, 10000)
Assert(result.msg, Don't enough trade)

ord1 = Place(0001000001, SSI, Buy, 20000, 100)
Assert(ord1.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, New)
event = GetOrderEvent(ord1.msg)
Assert(event, New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

result = Cancel(ord1.msg)
Assert(result.status, true)
status = GetOrderStatus(ord1.msg)
Assert(status, Canceled)
event = GetOrderEvent(ord1.msg)
Assert(event, New | Pending Cancel | Canceled)
count = CountOrderDetail(ord1.msg)
Assert(count, 3)

SetExchangeSession(HOSE, CLOSE)

result = Place(0001000001, SSI, Buy, 20000, 100)
Assert(result.msg, Exchange is close)
