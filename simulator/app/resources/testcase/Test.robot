ClearExchange()
ResetAccounts()

SetSession(HNX, OPEN1)

result = Place(0001000002, AAA, Sell, LO, 15300, 100)
Assert(result.status, true)

ord1 = Place(0001000003, AAA, Buy, LO, 15500, 100)
Assert(ord1.status, true)