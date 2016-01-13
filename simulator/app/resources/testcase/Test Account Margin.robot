OpenExchange()
OpenORS()
ClearExchange()
result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

SetAfType(1, 1000)
result = GetAfType(1)
Assert(result, 1000)

result = GetPP0(1)
Assert(result, 11300000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7533)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(1)
Assert(result, 11500000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7666)

ResetAccounts()