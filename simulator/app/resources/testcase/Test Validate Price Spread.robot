ClearExchange()
ResetAccounts()

SetSession(HNX, OPEN1) # HNX set sesison on ORS, GW, Ex is Open

SetSession(HOSE, OPEN1) # HOSE set sesison on ORS, GW, Ex is Open

result = Place(0001000001, AAA, Buy, LO, 15050, 100)
Assert(result.msg, Invalid price spread)

result = Place(0001000001, SSI, Buy, LO, 20050, 100)
Assert(result.msg, Invalid price spread)

result = Place(0001000001, MSN, Buy, LO, 70200, 100)
Assert(result.msg, Invalid price spread)

result = Place(0001000001, VNM, Buy, LO, 130900, 100)
Assert(result.msg, Invalid price spread)