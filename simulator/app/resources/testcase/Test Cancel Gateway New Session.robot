ClearExchange()
SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, NEW)
SetORSSession(HNX, NEW)

ord0 = Place(1, AAA, Buy, 2000, 100)
Assert(ord0.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)

result = Cancel(ord0.msg)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)

ResetAccounts()