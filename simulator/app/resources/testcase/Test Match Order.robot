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

ord4 = Place(2, AAA, Sell, 3000, 100)
Assert(ord4.status, true)

status = GetOrderStatus(ord4.msg)
Assert(status, New)
count = CountOrderDetail(ord4.msg)
Assert(count, 1)

ord5 = Replace(ord4.msg, 2800, 100)
Assert(ord4.status, true)

status = GetOrderStatus(ord5.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord4.msg)
Assert(count, 4)

ord6 = Replace(ord1.msg, 2900, 100)
Assert(ord6.status, true)

status = GetOrderStatus(ord5.msg)
Assert(status, Filled)
count = CountOrderDetail(ord4.msg)
Assert(count, 5)

status = GetOrderStatus(ord6.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 4)
event = GetOrderEvent(ord1.msg)
Assert(event, New | Pending Replace | Replaced | Partial Filled)

ord7 = Replace(ord6.msg, 2900, 600)
Assert(ord6.status, true)

status = GetOrderStatus(ord7.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 6)

result = Place(2, AAA, Sell, 2300, 100)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2200, 70)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2500, 100)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2200, 100)
Assert(result.status, true)

result = Place(2, AAA, Sell, 2300, 100)
Assert(result.status, true)

ord8 = Place(2, AAA, Sell, 2200, 100)
Assert(ord8.status, true)

status = GetOrderStatus(ord7.msg)
Assert(status, Filled)
count = CountOrderDetail(ord1.msg)
Assert(count, 12)

status = GetOrderStatus(ord8.msg)
Assert(status, Partial Filled)
count = CountOrderDetail(ord8.msg)
Assert(count, 2)

ord9 = Place(1, AAA, Buy, 2800, 20)
Assert(ord9.status, true)

status = GetOrderStatus(ord8.msg)
Assert(status, Filled)
event = GetOrderEvent(ord8.msg)
Assert(event, New | Parital Filled | Parital Filled | Filled)
count = CountOrderDetail(ord8.msg)
Assert(count, 3)

status = GetOrderStatus(ord9.msg)
Assert(status, Filled)
event = GetOrderEvent(ord9.msg)
Assert(event, New | Filled)
count = CountOrderDetail(ord9.msg)
Assert(count, 2)

ResetAccounts()