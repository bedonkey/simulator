ClearExchange()
ResetAccounts()
# Case: check pp0, qmax; change aftype; check qmax
SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)

result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

result = GetAfType(0001000001)
Assert(result, 100)

SetAfType(0001000001, 2000)
result = GetAfType(0001000001)
Assert(result, 2000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 7125)
