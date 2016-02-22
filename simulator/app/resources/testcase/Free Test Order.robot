SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)
ClearExchange()
ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

result = Place(0001000001, AAA, Buy, 50000, 100)
Assert(result.msg, Price must lower than ceil price)

result = Place(0001000001, AAA, Buy, 15000, 100)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

result = Place(0001000001, AAA, Buy, 15000, 100)
Assert(result.status, true)

result = Replace(result.msg, 15500, 200)
Assert(result.status, true)

result = Replace(result.msg, 15200, 300)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

result = Place(0001000001, AAA, Buy, 15800, 150)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, 15200, 100)
Assert(result.status, true)

# Case: place; cancel, cancel, match
result = Place(0001000003, AAA, Sell, 15500, 100)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

cancelOrder = Cancel(ord1.msg)
Assert(cancelOrder.status, true)

result = Place(0001000003, VND, Sell, 11500, 100)
Assert(result.status, true)

result = Place(0001000004, VND, Buy, 11500, 100)
Assert(result.status, true)

ResetAccounts()