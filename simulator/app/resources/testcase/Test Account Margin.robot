SetExchangeSession(HNX, OPEN1)
SetGatewaySession(HNX, OPEN1)
SetORSSession(HNX, OPEN1)
ClearExchange()
result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 666)

ord1 = Place(0001000001, AAA, Buy, 15000, 100)
Assert(ord1.status, true)

SetAfType(0001000001, 1000)
result = GetAfType(0001000001)
Assert(result, 1000)

result = GetPP0(0001000001)
Assert(result, 21500000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2388)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(0001000001)
Assert(result, 23000000)

result = GetQmax(0001000001, AAA, 15000)
Assert(result, 2555)

ResetAccounts()