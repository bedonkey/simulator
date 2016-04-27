ClearExchange()
ResetAccounts()

SetSession(HOSE, ATC)

ord1= Place(0001000001, SSI, Buy, ATC, 0, 50)
ord2= Place(0001000001, SSI, Buy, ATC, 0, 100)
ord3= Place(0001000004, SSI, Buy, LO, 20000, 60)
ord4= Place(0001000004, SSI, Buy, LO, 21000, 30)

ord5= Place(0001000003, SSI, Sell, LO, 21000, 20)
ord6= Place(0001000003, SSI, Sell, LO, 20000, 100)
ord7= Place(0001000002, SSI, Sell, ATC, 0, 20)
ord8= Place(0001000002, SSI, Sell, ATC, 0, 40)

SetSession(HOSE, PT)

count = CountOrderDetail(ord1.msg)
Assert(count, 3)
status = GetOrderStatus(ord1.msg)
Assert(status, Filled)
event = GetOrderEvent(ord1.msg)
Assert(event, New | Partial Filled | Filled)

count = CountOrderDetail(ord2.msg)
Assert(count, 3)
status = GetOrderStatus(ord2.msg)
Assert(status, Filled)

count = CountOrderDetail(ord3.msg)
Assert(count, 3)
status = GetOrderStatus(ord3.msg)
Assert(status, Partial Filled)

count = CountOrderDetail(ord4.msg)
Assert(count, 1)
status = GetOrderStatus(ord4.msg)
Assert(status, Expired)

count = CountOrderDetail(ord5.msg)
Assert(count, 2)
status = GetOrderStatus(ord5.msg)
Assert(status, Filled)

count = CountOrderDetail(ord6.msg)
Assert(count, 3)
status = GetOrderStatus(ord6.msg)
Assert(status, Filled)

count = CountOrderDetail(ord7.msg)
Assert(count, 3)
status = GetOrderStatus(ord7.msg)
Assert(status, Filled)

count = CountOrderDetail(ord8.msg)
Assert(count, 2)
status = GetOrderStatus(ord8.msg)
Assert(status, Filled)
event = GetOrderEvent(ord8.msg)
Assert(event, New | Filled)


