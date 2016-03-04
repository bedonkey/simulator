ClearExchange()
ResetAccounts()

SetSession(HNX, OPEN1)

ord1 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord1.status, true)

result = Place(0001000001, AAA, Buy, LO, 50000, 100)
Assert(result.msg, Price must lower than ceil price)

result = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

result = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(result.status, true)

result = Replace(result.msg, 15500, 200)
Assert(result.status, true)

result = Replace(result.msg, 15200, 300)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

result = Place(0001000001, AAA, Buy, LO, 15800, 150)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, LO, 15200, 100)
Assert(result.status, true)

# Case: place; cancel, cancel, match
result = Place(0001000003, AAA, Sell, LO, 15500, 100)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

cancelOrder = Cancel(ord1.msg)
Assert(cancelOrder.status, true)

result = Place(0001000003, VND, Sell, LO, 11500, 100)
Assert(result.status, true)

result = Place(0001000004, VND, Buy, LO, 11500, 100)
Assert(result.status, true)