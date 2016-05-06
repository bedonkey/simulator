ClearExchange()
ResetAccounts()

SetSession(HNX, OPEN1)

ord1 = Place(0001000001, VND, Buy, LO, 15000, 100)
Assert(ord1.status, true)

ord2 = Place(0001000001, VND, Buy, MTL, 0, 100)
Assert(ord2.status, true)

count = CountOrderDetail(ord2.msg)
Assert(count, 2)
status = GetOrderStatus(ord2.msg)
Assert(status, Filled)

ord3 = Place(0001000002, VND, Sell, LO, 15000, 100)
Assert(ord3.status, true)

ord4 = Place(0001000001, VND, Buy, MTL, 0, 200)
Assert(ord4.status, true)

count = CountOrderDetail(ord4.msg)
Assert(count, 3)
status = GetOrderStatus(ord4.msg)
Assert(status, New)

event = GetOrderEvent(ord4.msg)
Assert(event, New | Partial Filled| New LO)

ord5 = Place(0001000002, VND, Sell, LO, 15000, 100)
Assert(ord5.status, true)

count = CountOrderDetail(ord4.msg)
Assert(count, 4)
status = GetOrderStatus(ord4.msg)
Assert(status, Filled)
event = GetOrderEvent(ord4.msg)
Assert(event, New | Partial Filled | New LO | Filled)
