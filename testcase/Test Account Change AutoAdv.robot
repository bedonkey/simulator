# Case: place match; set autoAdv; check PP0, Qmax; place; check Qmax; disable autoAdv; check PP0; cancel; check PP0
result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

result = Place(1, AAA, Sell, 2000, 100)
Assert(result.status, true)

result = Place(2, AAA, Buy, 2000, 100)
Assert(result.status, true)

result = GetPP0(1)
Assert(result, 10000000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5000)

SetAutoAdv(1)

result = GetPP0(1)
Assert(result, 10200000)

result = GetQmax(1, AAA, 2000)
Assert(result, 5100)

ord1 = Place(1, AAA, Buy, 2000, 5100)
Assert(ord1.status, true)

result = GetQmax(1, AAA, 2000)
Assert(result, 0)

DisableAutoAdv(1)

result = GetPP0(1)
Assert(result, -200000)

result = Cancel(ord1.msg)
Assert(result.status, true)

result = GetPP0(1)
Assert(result, 10000000)

ResetAccounts()