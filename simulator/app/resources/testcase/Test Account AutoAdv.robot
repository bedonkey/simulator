# Case: change aftype none margin; set autoAdv, place match, cancel remain, check PP0
OpenExchange()
SetAfType(1, 100)
result = GetAfType(1)
Assert(result, 100)

SetAutoAdv(2)
result = GetAutoAdv(2)
Assert(result, true)

ord1 = Place(1, AAA, Buy, 2800, 150)
Assert(ord1.status, true)

Place(2, AAA, Sell, 2200, 100)

cancelOrder = Cancel(ord1.msg)
Assert(cancelOrder.status, true)

result = GetPP0(1)
Assert(result, 9720000)

result = GetPP0(2)
Assert(result, 10280000 )

ResetAccounts()