ClearExchange()
ResetAccounts()

SetSession(HNX, NEW)
SetSession(HOSE, NEW)

result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetPP0(0001000002)
Assert(result, 10000000)

ord0 = Place(0001000001, VND, Buy, MP, 0, 100)
Assert(ord0.status, false)
Assert(ord0.msg, Can not place MP order in HNX)

ord1 = Place(0001000002, SSI, Sell, MP, 0, 100)
Assert(ord1.status, false)
Assert(ord1.msg, Can not place MP order in NEW session)

SetSession(HOSE, ATO)

ord2 = Place(0001000002, SSI, Sell, MP, 0, 100)
Assert(ord2.status, false)
Assert(ord2.msg, Can not place MP order in ATO session)

SetSession(HOSE, OPEN1)

ord3 = Place(0001000001, SSI, Buy, MP, 0, 100)
Assert(ord3.status, true)

count = CountOrderDetail(ord3.msg)
Assert(count, 1)
status = GetOrderStatus(ord3.msg)
Assert(status, Expired)

result = GetPP0(0001000001)
Assert(result, 10000000)

SetSession(HOSE, ATC)
ord3 = Place(0001000001, SSI, Buy, MP, 0, 100)
Assert(ord3.msg, Can not place MP order in ATC session)

result = GetPP0(0001000001)
Assert(result, 10000000)