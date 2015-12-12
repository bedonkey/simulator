# Case1: place, replace, change aftype, cancel
OpenExchange()
result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

ord2 = Replace(ord1.msg, 2500, 200)
Assert(ord2.status, true)

SetAfType(1, 1000)
result = GetAfType(1)
Assert(result, 1000)

result = GetPP0(1)
Assert(result, 11000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7333)

result = Cancel(ord2.msg)
Assert(result.status, true)

result = GetPP0(1)
Assert(result, 11500000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7666)

ResetAccounts()

# Case2: place, change aftype, replace, cancel
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

ord2 = Replace(ord1.msg, 2500, 200)
Assert(ord2.status, true)

result = GetPP0(1)
Assert(result, 11100000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7400)

result = Cancel(ord2.msg)
Assert(result.status, true)

result = GetPP0(1)
Assert(result, 11500000)

result = GetQmax(1, AAA, 2000)
Assert(result, 7666)

ResetAccounts()