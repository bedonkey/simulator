OpenExchange()
OpenGateway()
OpenORS()
ClearExchange()
ord1 = Place(3, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

result = Place(1, AAA, Buy, 2800, 150)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2200, 100)
Assert(result.status, true)

result = Place(2, AAA, Sell, 3000, 100)
Assert(result.status, true)

result = Replace(result.msg, 2800, 100)
Assert(result.status, true)

result = Replace(ord1.msg, 2900, 100)
Assert(result.status, true)

result = Replace(result.msg, 2900, 600)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2300, 100)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2200, 70)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2500, 100)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2200, 100)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2300, 100)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2200, 100)
Assert(result.status, true)

result = Place(1, AAA, Buy, 2800, 20)
Assert(result.status, true)

ResetAccounts()