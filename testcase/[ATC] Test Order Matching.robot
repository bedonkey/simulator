ClearExchange()
ResetAccounts()

SetSession(HOSE, ATC)

ord1= Place(0001000001, SSI, Buy, ATC, 0, 100)
ord2= Place(0001000004, SSI, Buy, LO, 21000, 20)

ord3= Place(0001000003, SSI, Sell, LO, 21000, 10)
ord4= Place(0001000002, SSI, Sell, ATC, 0, 20)

SetSession(HOSE, PT)

count = CountOrderDetail(ord2.msg)
Assert(count, 2)
status = GetOrderStatus(ord2.msg)
Assert(status, Expired)

count = CountOrderDetail(ord3.msg)
Assert(count, 2)
status = GetOrderStatus(ord3.msg)
Assert(status, Filled)

count = CountOrderDetail(ord4.msg)
Assert(count, 2)
status = GetOrderStatus(ord4.msg)
Assert(status, Filled)

count = CountOrderDetail(ord1.msg)
Assert(count, 4)
status = GetOrderStatus(ord1.msg)
Assert(status, Expired)
