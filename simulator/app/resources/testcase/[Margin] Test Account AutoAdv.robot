ClearExchange()
ResetAccounts()

# Case: change aftype none margin; set autoAdv, place match, cancel remain, check PP0
SetSession(HNX, OPEN1)

SetAfType(0001000001, 100)
result = GetAfType(0001000001)
Assert(result, 100)

SetAutoAdv(0001000002)
result = GetAutoAdv(0001000002)
Assert(result, true)

ord1 = Place(0001000001, AAA, Buy, LO, 15800, 150)
Assert(ord1.status, true)

Place(0001000002, AAA, Sell, LO, 15200, 100)

cancelOrder = Cancel(ord1.msg)
Assert(cancelOrder.status, true)

result = GetPP0(0001000001)
Assert(result, 8420000)

result = GetPP0(0001000002)
Assert(result, 11580000)
