ClearExchange()
ResetAccounts()

SetSession(HNX, NEW)
SetSession(HOSE, NEW)

ord0 = Place(0001000001, VND, Buy, ATC, 0, 100)
Assert(ord0.status, true)

ord1 = Place(0001000002, SSI, Sell, ATC, 0, 100)
Assert(ord0.status, true)

count = CountOrderDetail(ord0.msg)
Assert(count, 1)
status = GetOrderStatus(ord0.msg)
Assert(status, Pending New)

count = CountOrderDetail(ord1.msg)
Assert(count, 1)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)


result = Cancel(ord0.msg)
Assert(result.status, true)
count = CountOrderDetail(ord0.msg)
Assert(count, 3)
status = GetOrderStatus(ord0.msg)
Assert(status, Canceled)

SetSession(HNX, OPEN1)
SetSession(HOSE, OPEN1)

count = CountOrderDetail(ord1.msg)
Assert(count, 1)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)

ord2 = Place(0001000001, VND, Buy, ATC, 0, 100)
Assert(ord0.status, true)

count = CountOrderDetail(ord2.msg)
Assert(count, 1)
status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)

SetSession(HNX, INTERMISSION)
SetSession(HOSE, INTERMISSION)

count = CountOrderDetail(ord1.msg)
Assert(count, 1)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)

count = CountOrderDetail(ord2.msg)
Assert(count, 1)
status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)

SetSession(HNX, OPEN2)
SetSession(HOSE, OPEN2)

count = CountOrderDetail(ord1.msg)
Assert(count, 1)
status = GetOrderStatus(ord1.msg)
Assert(status, Pending New)

count = CountOrderDetail(ord2.msg)
Assert(count, 1)
status = GetOrderStatus(ord2.msg)
Assert(status, Pending New)

SetSession(HNX, ATC)
SetSession(HOSE, ATC)

count = CountOrderDetail(ord1.msg)
Assert(count, 2)
status = GetOrderStatus(ord1.msg)
Assert(status, New)

count = CountOrderDetail(ord2.msg)
Assert(count, 2)
status = GetOrderStatus(ord2.msg)
Assert(status, New)

ord3 = Place(0001000001, VND, Buy, ATC, 0, 100)
Assert(ord0.status, true)

count = CountOrderDetail(ord3.msg)
Assert(count, 1)
status = GetOrderStatus(ord3.msg)
Assert(status, New)

result = Cancel(ord3.msg)
Assert(result.status, false)
Assert(result.msg, Can not cancel ATC order in ATC session)

SetSession(HNX, PT)
SetSession(HOSE, PT)

count = CountOrderDetail(ord1.msg)
Assert(count, 3)
status = GetOrderStatus(ord1.msg)
Assert(status, Expired)

count = CountOrderDetail(ord2.msg)
Assert(count, 3)
status = GetOrderStatus(ord2.msg)
Assert(status, Expired)

count = CountOrderDetail(ord3.msg)
Assert(count, 4)
status = GetOrderStatus(ord3.msg)
Assert(status, Expired)