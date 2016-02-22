# Case 0: change aftype, place, match partial filled, cancel
SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)
ClearExchange()
SetAfType(0001000001, 1000)

result = GetAfType(0001000001)
Assert(result, 1000)

result = GetPP0(0001000001)
Assert(result, 23000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2555)

ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

ord2 = Place(0001000002, AAA, Sell, 15000, 50)
Assert(ord2.status, true)

result = GetPP0(0001000001)
Assert(result, 22400000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2488)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(0001000001)
Assert(result, 22850000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2538)

ResetAccounts()

# Case 1: place, match partial filled, change aftype, cancel
result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

ord2 = Place(0001000002, AAA, Sell, 15000, 50)
Assert(ord2.status, true)

result = GetPP0(0001000001)
Assert(result, 8500000)

SetAfType(0001000001, 1000)

result = GetAfType(0001000001)
Assert(result, 1000)

result = GetPP0(0001000001)
Assert(result, 21800000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2422)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(0001000001)
Assert(result, 22550000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2505)

ResetAccounts()

# Case 2: place, change aftype, match partial filled, cancel
result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

result = GetPP0(0001000001)
Assert(result, 8500000)

SetAfType(0001000001, 1000)
result = GetAfType(0001000001)
Assert(result, 1000)

ord2 = Place(0001000002, AAA, Sell, 15000, 50)
Assert(ord2.status, true)

result = GetPP0(0001000001)
Assert(result, 21800000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2422)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(0001000001)
Assert(result, 22550000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2505)

ResetAccounts()