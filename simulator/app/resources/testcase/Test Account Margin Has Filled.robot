# Case 0: change aftype, place, match filled
OpenExchange()
OpenORS()
ClearExchange()
SetAfType(1, 1000)
result = GetAfType(1)
Assert(result, 1000)

result = GetPP0(1)
Assert(result, 11500000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7666)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

ord2 = Place(2, AAA, Sell, 2000, 100)
Assert(ord2.status, true)

result = GetPP0(1)
Assert(result, 11400000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7600)

ResetAccounts()

# Case 1: place, match filled, change aftype
result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

ord2 = Place(2, AAA, Sell, 2000, 100)
Assert(ord2.status, true)

result = GetPP0(1)
Assert(result, 9800000)

SetAfType(1, 1000)

result = GetAfType(1)
Assert(result, 1000)

result = GetPP0(1)
Assert(result, 11350000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7566)

ResetAccounts()

# Case 2: place, change aftype, match filled
result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

result = GetPP0(1)
Assert(result, 9800000)

SetAfType(1, 1000)
result = GetAfType(1)
Assert(result, 1000)

ord2 = Place(2, AAA, Sell, 2000, 100)
Assert(ord2.status, true)

result = GetPP0(1)
Assert(result, 11350000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7566)

ResetAccounts()