# Case: check pp0, Qmax; change aftype 1000, check PP0, Qmax; change aftype 2000; check PP0, Qmax
OpenExchange()
OpenGateway()
OpenORS()
ClearExchange()
ResetAccounts()

result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

SetAfType(1, 1000)
result = GetAfType(1)
Assert(result, 1000)

result = GetPP0(1)
Assert(result, 11500000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7666)

SetAfType(1, 2000)
result = GetAfType(1)
Assert(result, 2000)

result = GetPP0(1)
Assert(result, 13500000)

result = GetQmax(1, AAA, 2000)
Assert(result, 9000)

ResetAccounts()