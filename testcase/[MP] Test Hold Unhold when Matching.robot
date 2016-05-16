ClearExchange()
ResetAccounts()

SetSession(HOSE, OPEN1)

result = GetPP0(0001000001)
Assert(result, 10000000)

ord1 = Place(0001000002, SSI, Sell, LO, 21000, 100)
Assert(ord1.status, true)

ord2 = Place(0001000001, SSI, Buy, MP, 0, 100)
Assert(ord2.status, true)

count = CountOrderDetail(ord2.msg)
Assert(count, 2)
status = GetOrderStatus(ord2.msg)
Assert(status, Filled)

result = GetPP0(0001000001)
Assert(result, 7900000)

ord3 = Place(0001000002, SSI, Sell, LO, 21000, 100)
Assert(ord3.status, true)

ord4 = Place(0001000001, SSI, Buy, MP, 0, 200)
Assert(ord4.status, true)

result = GetPP0(0001000001)
Assert(result, 3700000)

ord5 = Place(0001000002, SSI, Sell, LO, 21000, 100)
Assert(ord5.status, true)

count = CountOrderDetail(ord5.msg)
Assert(count, 2)
status = GetOrderStatus(ord5.msg)
Assert(status, Filled)

result = GetPP0(0001000001)
Assert(result, 3700000)