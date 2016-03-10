ClearExchange()
ResetAccounts()

SetSession(HOSE, ATO)

ord1= Place(0001000003, SSI, Buy, ATO, 0, 100)
ord2= Place(0001000004, SSI, Buy, LO, 21000, 20)

ord3= Place(0001000001, SSI, Sell, LO, 21000, 10)
ord4= Place(0001000002, SSI, Sell, ATO, 0, 20)

SetSession(HOSE, OPEN1)

count = CountOrderDetail(ord1.msg)
Assert(count, 4)
status = GetOrderStatus(ord2.msg)
Assert(status, Expired)

count = CountOrderDetail(ord2.msg)
Assert(count, 1)
status = GetOrderStatus(ord2.msg)
Assert(status, New)

count = CountOrderDetail(ord3.msg)
Assert(count, 2)
status = GetOrderStatus(ord3.msg)
Assert(status, Filled)

count = CountOrderDetail(ord4.msg)
Assert(count, 2)
status = GetOrderStatus(ord4.msg)
Assert(status, Filled)
