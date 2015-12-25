OpenExchange()
ClearExchange()
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

# Case: place; cancel, cancel, match
result = Place(3, AAA, Sell, 2500, 100)
Assert(result.status, true)

result = Cancel(result.msg)
Assert(result.status, true)

cancelOrder = Cancel(ord1.msg)
Assert(cancelOrder.status, true)

result = Place(3, BBB, Sell, 2500, 100)
Assert(result.status, true)

result = Place(4, BBB, Buy, 2500, 100)
Assert(result.status, true)

ResetAccounts()