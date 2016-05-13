ClearExchange()
ResetAccounts()

SetSession(HNX, OPEN1)

result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetPP0(0001000002)
Assert(result, 10000000)

ord1 = Place(0001000002, VND, Sell, LO, 11000, 100)
Assert(ord1.status, true)

ord2 = Place(0001000001, VND, Buy, MOK, 0, 100)
Assert(ord2.status, true)

count = CountOrderDetail(ord2.msg)
Assert(count, 2)
status = GetOrderStatus(ord2.msg)
Assert(status, Filled)

result = GetPP0(0001000001)
Assert(result, 8900000)

ord3 = Place(0001000002, VND, Sell, LO, 11000, 100)
Assert(ord3.status, true)

ord4 = Place(0001000001, VND, Buy, MOK, 0, 200)
Assert(ord4.status, true)

count = CountOrderDetail(ord4.msg)
Assert(count, 1)
status = GetOrderStatus(ord4.msg)
Assert(status, Expired)

result = GetPP0(0001000001)
Assert(result, 8900000)