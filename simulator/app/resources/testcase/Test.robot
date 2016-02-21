SetExchangeSession(HNX, INTERMISSION) # Set session on Exchange is Open
SetGatewaySession(HNX, INTERMISSION) # Set session on Gateway is Open
SetORSSession(HNX, INTERMISSION) # Set sesison on ORS is Open
ClearExchange() # Clear all order on Exchange

ord1 = Place(1, AAA, Buy, 2000, 100)

ord2 = Replace(ord1.msg, 2500, 200)
ResetAccounts()