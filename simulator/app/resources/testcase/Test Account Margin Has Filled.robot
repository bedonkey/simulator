ClearExchange()
ResetAccounts()

# Case 0: change aftype, place, match filled
SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)

SetAfType(0001000001, 1000)
result = GetAfType(0001000001)
Assert(result, 1000)

result = GetPP0(0001000001)
Assert(result, 23000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2555)

ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

ord2 = Place(0001000002, AAA, Sell, 15000, 100)
Assert(ord2.status, true)

result = GetPP0(0001000001)
Assert(result, 22700000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2522)

ResetAccounts()

# Case 1: place, match filled, change aftype
result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

ord2 = Place(0001000002, AAA, Sell, 15000, 100)
Assert(ord2.status, true)

result = GetPP0(0001000001)
Assert(result, 8500000)

SetAfType(0001000001, 1000)

result = GetAfType(0001000001)
Assert(result, 1000)

result = GetPP0(0001000001)
Assert(result, 22100000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2455)

ResetAccounts()

# Case 2: place, change aftype, match filled
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

ord2 = Place(0001000002, AAA, Sell, 15000, 100)
Assert(ord2.status, true)

result = GetPP0(0001000001)
Assert(result, 22100000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2455)
