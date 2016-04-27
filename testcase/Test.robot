ClearExchange()
ResetAccounts()
SetSession(HNX, OPEN1)

ord0 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord0.status, true)

ord1 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord0.status, true)

SetExchangeSession(HNX, CLOSE)

result = Cancel(ord0.msg)
ord2 = Replace(ord1.msg, 15500, 200)
