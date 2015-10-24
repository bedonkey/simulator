# Case 0: change aftype, place, match partial filled, cancel
SetAfType(1, 1000)

result = GetAfType(1)
Assert(result, 1000)

result = GetPP0(1)
Assert(result, 11500000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7666)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

ord2 = Place(2, AAA, Sell, 2000, 50)
Assert(ord2.status, true)

result = GetPP0(1)
Assert(result, 11375000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7583)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(1)
Assert(result, 11450000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7633)

ResetAccounts()

# Case 1: place, match partial filled, change aftype, cancel
result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

ord2 = Place(2, AAA, Sell, 2000, 50)
Assert(ord2.status, true)

result = GetPP0(1)
Assert(result, 9800000)

SetAfType(1, 1000)

result = GetAfType(1)
Assert(result, 1000)

result = GetPP0(1)
Assert(result, 11325000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7550)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(1)
Assert(result, 11425000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7616)

ResetAccounts()

# Case 2: place, change aftype, match partial filled, cancel
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

ord2 = Place(2, AAA, Sell, 2000, 50)
Assert(ord2.status, true)

result = GetPP0(1)
Assert(result, 11325000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7550)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(1)
Assert(result, 11425000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7616)

ResetAccounts()