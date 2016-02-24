ClearExchange()
ResetAccounts()

SetExchangeSession(HNX, OPEN1) # Set session on Exchange is Open
SetGatewaySession(HNX, OPEN1) # Set session on Gateway is Open
SetORSSession(HNX, OPEN1) # Set sesison on ORS is Open

SetExchangeSession(HOSE, OPEN1) # Set session on Exchange is Open
SetGatewaySession(HOSE, OPEN1) # Set session on Gateway is Open
SetORSSession(HOSE, OPEN1) # Set sesison on ORS is Open

result = Place(0001000001, AAA, Buy, 15050, 100)
Assert(result.msg, Invalid price spread)

result = Place(0001000001, SSI, Buy, 20050, 100)
Assert(result.msg, Invalid price spread)

result = Place(0001000001, MSN, Buy, 70200, 100)
Assert(result.msg, Invalid price spread)

result = Place(0001000001, VNM, Buy, 130900, 100)
Assert(result.msg, Invalid price spread)