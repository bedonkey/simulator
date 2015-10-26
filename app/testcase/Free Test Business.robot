# Case: check pp0, qmax; change aftype; check qmax
result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

result = GetAfType(1)
Assert(result, 100)

SetAfType(1, 2000)
result = GetAfType(1)
Assert(result, 2000)

result = GetQmax(1, AAA, 2000)
Assert(result, 9000)

ResetAccounts()