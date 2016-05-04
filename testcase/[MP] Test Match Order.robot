ClearExchange()
ResetAccounts()

SetSession(HOSE, OPEN1)

ord3 = Place(0001000001, SSI, Buy, MP, 0, 100)
Assert(ord0.status, true)

count = CountOrderDetail(ord2.msg)
Assert(count, 1)
status = GetOrderStatus(ord2.msg)
Assert(status, Expired)

ord4 = Place(0001000001, SSI, Buy, LO, 21000, 100)
Assert(ord0.status, true)

ord5 = Place(0001000001, SSI, Buy, MP, 0, 100)
Assert(ord0.status, true)

count = CountOrderDetail(ord5.msg)
Assert(count, 2)
status = GetOrderStatus(ord5.msg)
Assert(status, Filled)

ord6 = Place(0001000002, SSI, Sell, LO, 21000, 100)
Assert(ord0.status, true)

ord7 = Place(0001000001, SSI, Buy, MP, 0, 200)
Assert(ord0.status, true)

count = CountOrderDetail(ord7.msg)
Assert(count, 3)
status = GetOrderStatus(ord7.msg)
Assert(status, New)

event = GetOrderEvent(ord7.msg)
Assert(event, New | Partial Filled| New LO)

ord8 = Place(0001000002, SSI, Sell, LO, 21000, 100)
Assert(ord0.status, true)

count = CountOrderDetail(ord7.msg)
Assert(count, 4)
status = GetOrderStatus(ord7.msg)
Assert(status, Filled)
event = GetOrderEvent(ord7.msg)
Assert(event, New | Partial Filled | New LO | Filled)
