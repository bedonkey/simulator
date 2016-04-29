ClearExchange()
ResetAccounts()

SetSession(HOSE, ATC)

result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetTrade(0001000002, SSI)
Assert(result, 1000)

ord1= Place(0001000001, SSI, Buy, ATC, 0, 100)
ord2= Place(0001000002, SSI, Sell, ATC, 0, 100)

result = GetPP0(0001000001)
Assert(result, 7800000)

result = GetTrade(0001000002, SSI)
Assert(result, 900)

SetSession(HOSE, PT)

result = GetPP0(0001000001)
Assert(result, 10000000)

result = GetTrade(0001000002, SSI)
Assert(result, 1000)
