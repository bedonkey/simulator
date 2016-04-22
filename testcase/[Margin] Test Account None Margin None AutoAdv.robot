ClearExchange()
ResetAccounts()

SetSession(HNX, OPEN1)

SetAfType(0001000001, 100)
result = GetAfType(0001000001)
Assert(result, 100)

DisableAutoAdv(0001000001)

SetAfType(0001000002, 100)
result = GetAfType(0001000002)
Assert(result, 100)

DisableAutoAdv(0001000002)

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

ord1 = Place(0001000001, AAA, Buy, LO, 15800, 150)
Assert(ord1.status, true)

result = Place(0001000002, AAA, Sell, LO, 15200, 100)
Log(result)

cancelOrder = Cancel(ord1.msg)
Assert(cancelOrder.status, true)

result = GetPP0(0001000001)
Assert(result, 8420000)

result = GetPP0(0001000002)
Assert(result, 10000000)
