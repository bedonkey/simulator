OpenExchange()
OpenGateway()
OpenORS()
ClearExchange()

ord1 = Place(3, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

ord2 = Place(1, AAA, Buy, 2800, 150)
Assert(ord2.status, true)

status = GetOrderStatus(ord1.msg)
Assert(status, New)
count = CountOrderDetail(ord1.msg)
Assert(count, 1)

status = GetOrderStatus(ord2.msg)
Assert(status, New)
count = CountOrderDetail(ord2.msg)
Assert(count, 1)

ord3 = Place(2, AAA, Sell, 2200, 100)
Assert(ord3.status, true)

status = GetOrderStatus(ord2.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord3.msg)
Assert(count, 2)

status = GetOrderStatus(ord3.msg)
Assert(status, Filled)
count = CountOrderDetail(ord3.msg)
Assert(count, 2)


ResetAccounts()