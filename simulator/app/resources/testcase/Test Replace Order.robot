OpenExchange()
OpenGateway()
OpenORS()
ClearExchange()

ord0 = Place(1, AAA, Buy, 2000, 100)
Assert(ord0.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 1)

result = Replace(ord0.msg, 2500, 200)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)

result = Replace(result.msg, 2200, 300)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 5)

result = Cancel(result.msg)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 7)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

result = Replace(ord1.msg, 5000, 200)
Assert(result.msg, Price must lower than ceil price)

result = Replace(ord1.msg, 500, 200)
Assert(result.msg, Price must larger than floor price)

result = Replace(ord1.msg, 2000, 1000000)
Assert(result.msg, Don't enough balance)

result = Cancel(ord1.msg)
Assert(result.status, true)

ord2 = Place(2, AAA, Sell, 2000, 100)
Assert(ord2.status, true)

result = Replace(ord2.msg, 2000, 1000000)
Assert(result.msg, Don't enough trade)

result = Cancel(ord2.msg)
Assert(result.status, true)

ResetAccounts()