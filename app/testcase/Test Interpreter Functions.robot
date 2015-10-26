result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

result = GetAfType(1)
Assert(result, 100)

SetAfType(1, 2000)
result = GetAfType(1)
Assert(result, 2000)

result = GetQmax(1, AAA, 2000)
Assert(result, 9000)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

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

result = Place(1, AAA, Buy, 2800, 150)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2200, 100)
Assert(result.status, true)

result = Place(3, AAA, Sell, 2500, 100)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

cancelOrder = Cancel(ord1.msg)
Assert(cancelOrder.status, true)

ResetAccounts()