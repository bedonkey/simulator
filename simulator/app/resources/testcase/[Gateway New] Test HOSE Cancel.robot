ClearExchange()
ResetAccounts()

SetExchangeSession(HOSE, OPEN1)
SetGatewaySession(HOSE, NEW)
SetORSSession(HOSE, NEW)

ord0 = Place(0001000001, SSI, Buy, LO, 20000, 100)
Log(ord0)
Assert(ord0.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)

result = Cancel(ord0.msg)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)
