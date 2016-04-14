ClearExchange()
ResetAccounts()

# Case: check pp0, Qmax; change aftype 1000, check PP0, Qmax; change aftype 2000; check PP0, Qmax
SetSession(HNX, OPEN1)

result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

SetAfType(0001000001, 1000)
result = GetAfType(0001000001)
Assert(result, 1000)

result = GetPP0(0001000001)
Assert(result, 23000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2555)

SetAfType(0001000001, 2000)
result = GetAfType(0001000001)
Assert(result, 2000)

result = GetPP0(0001000001)
Assert(result, 57000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 7125)
