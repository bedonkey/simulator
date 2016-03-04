ClearExchange()
ResetAccounts()

# Case1: place, replace, change aftype, cancel
SetSession(HNX, OPEN1)

result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

ord1 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord1.status, true)

ord2 = Replace(ord1.msg, 15500, 200)
Assert(ord2.status, true)

SetAfType(0001000001, 1000)
result = GetAfType(0001000001)
Assert(result, 1000)

result = GetPP0(0001000001)
Assert(result, 19900000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2211)

result = Cancel(ord2.msg)
Assert(result.status, true)

result = GetPP0(0001000001)
Assert(result, 23000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2555)

ResetAccounts()

# Case2: place, change aftype, replace, cancel
result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

ord1 = Place(0001000001, AAA, Buy, LO, 15000, 100)
Assert(ord1.status, true)

SetAfType(0001000001, 1000)

result = GetAfType(0001000001)
Assert(result, 1000)

result = GetPP0(0001000001)
Assert(result, 21500000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2388)

ord2 = Replace(ord1.msg, 15500, 200)
Assert(ord2.status, true)

result = GetPP0(0001000001)
Assert(result, 21100000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2344)

result = Cancel(ord2.msg)
Assert(result.status, true)

result = GetPP0(0001000001)
Assert(result, 23000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2555)
