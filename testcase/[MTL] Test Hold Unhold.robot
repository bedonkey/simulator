ClearExchange()
ResetAccounts()

SetSession(HNX, NEW)
SetSession(HOSE, NEW)

result = GetPP0(0001000001)
Assert(result, 10000000)

ord0 = Place(0001000001, SSI, Buy, MTL, 0, 100)
Assert(ord0.status, false)
Assert(ord0.msg, Can not place MTL order in HOSE)

ord1 = Place(0001000002, VND, Sell, MTL, 0, 100)
Assert(ord1.status, false)
Assert(ord1.msg, Can not place MTL order in NEW session)

SetSession(HNX, OPEN1)

ord3 = Place(0001000001, VND, Buy, MTL, 0, 100)
Assert(ord3.status, true)

count = CountOrderDetail(ord3.msg)
Assert(count, 1)
status = GetOrderStatus(ord3.msg)
Assert(status, Expired)

result = GetPP0(0001000001)
Assert(result, 10000000)

SetSession(HNX, ATC)
ord3 = Place(0001000001, VND, Buy, MTL, 0, 100)
Assert(ord3.msg, Can not place MTL order in ATC session)

result = GetPP0(0001000001)
Assert(result, 10000000)