ClearExchange()
ResetAccounts()

SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)

result = Place(0001000001, AAA, Buy, 15000, 100)
Assert(result.status, true)

result1 = Cancel(result.msg)
Assert(result1.status, true)
count = CountOrderDetail(result.msg)
Assert(count, 3)

result2 = Cancel(result.msg)
Assert(result2.msg, Order not found)

result = Place(0001000001, VND, Buy, 11000, 100)
Assert(result.status, true)

result1 = Cancel(result.msg)
Assert(result1.status, true)
