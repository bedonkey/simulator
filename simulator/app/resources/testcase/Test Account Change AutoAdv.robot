# Case: place match; set autoAdv; check PP0, Qmax; place; check Qmax; disable autoAdv; check PP0; cancel; check PP0
SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)
ClearExchange()
result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

result = Place(0001000001, AAA, Sell, 15000, 100)
Assert(result.status, true)

result = Place(0001000002, AAA, Buy, 15000, 100)
Assert(result.status, true)

result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

SetAutoAdv(0001000001)

result = GetPP0(0001000001)
Assert(result, 11500000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 766)

ord1 = Place(0001000001, VND, Buy, 11000, 766)
Assert(ord1.status, true)

result = GetQmax(0001000001, VND, 11000)
Assert(result, 279)

DisableAutoAdv(0001000001)

result = GetPP0(0001000001)
Assert(result, 1574000)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(0001000001)
Assert(result, 10000000)

ResetAccounts()