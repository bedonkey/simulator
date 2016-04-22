ClearExchange()
ResetAccounts()

SetSession(HNX, OPEN1)

result = Place(0001000002, AAA, Sell, LO, 15300, 100)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, LO, 15200, 70)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, LO, 15500, 100)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, LO, 15200, 100)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, LO, 15300, 100)
Assert(result.status, true)

result = Place(0001000002, AAA, Sell, LO, 15300, 30)
Assert(result.status, true)

ord1 = Place(0001000003, AAA, Buy, LO, 15500, 500)
Assert(ord1.status, true)

status = GetOrderStatus(ord1.msg)
Assert(status, Filled)
event = GetOrderEvent(ord1.msg)
Assert(event, New | Partial Filled | Partial Filled | Partial Filled | Partial Filled | Partial Filled | Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 7)