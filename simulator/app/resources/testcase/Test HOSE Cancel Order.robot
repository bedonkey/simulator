ClearExchange()
ResetAccounts()

SetSession(HOSE, OPEN1)

result = Place(0001000001, SSI, Buy, LO, 20000, 100)
Assert(result.status, true)

result1 = Cancel(result.msg)
Assert(result1.status, true)
count = CountOrderDetail(result.msg)
Assert(count, 3)

result2 = Cancel(result.msg)
Assert(result2.msg, Order not found)

result = Place(0001000001, VND, Buy, LO, 11000, 100)
Assert(result.status, true)

result1 = Cancel(result.msg)
Assert(result1.status, true)
