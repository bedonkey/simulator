SetAfType(1, 100)
result = GetAfType(1)
Assert(result, 100)

DisableAutoAdv(1)

SetAfType(2, 100)
result = GetAfType(2)
Assert(result, 100)

DisableAutoAdv(2)

result = Place(1, AAA, Buy, 5000, 100)
Assert(result.msg, Price must lower than ceil price)

result = Place(1, AAA, Buy, 2000, 100)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

result = Place(1, AAA, Buy, 2000, 100)
Assert(result.status, true)

result = Replace(result.msg, 2500, 200)
Assert(result.status, true)

result = Replace(result.msg, 2200, 300)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

ord1 = Place(1, AAA, Buy, 2800, 150)
Assert(ord1.status, true)

result = Place(2, AAA, Sell, 2200, 100)
Log(result)

cancelOrder = Cancel(ord1.msg)
Assert(cancelOrder.status, true)

result = GetPP0(1)
Assert(result, 9720000)

result = GetPP0(2)
Assert(result, 10000000)

ResetAccounts()