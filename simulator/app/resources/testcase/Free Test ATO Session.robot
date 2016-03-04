ClearExchange()
ResetAccounts()

SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, NEW)
SetORSSession(HNX, NEW)

ord0 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord0.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)

ord1 = Replace(ord0.msg, 15500, 200)
Assert(ord1.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)

ord2 = Replace(ord1.msg, 15200, 300)
Assert(ord2.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 5)

result = Cancel(ord2.msg)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 7)
