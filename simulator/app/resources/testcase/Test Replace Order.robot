ClearExchange()
ResetAccounts()

SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)
ClearExchange()

ord0 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord0.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)

result = Replace(ord0.msg, 15500, 200)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)

result = Replace(result.msg, 15200, 300)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 5)

result = Cancel(result.msg)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 7)

ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

result = Replace(ord1.msg, 50000, 200)
Assert(result.msg, Price must lower than ceil price)

result = Replace(ord1.msg, 5000, 200)
Assert(result.msg, Price must larger than floor price)

result = Replace(ord1.msg, 15000, 1000000)
Assert(result.msg, Don't enough balance)

result = Cancel(ord1.msg)
Assert(result.status, true)

ord2 = Place(0001000002, AAA, Sell, 15000, 100)
Assert(ord2.status, true)

result = Replace(ord2.msg, 15000, 1000000)
Assert(result.msg, Don't enough trade)

result = Cancel(ord2.msg)
Assert(result.status, true)
