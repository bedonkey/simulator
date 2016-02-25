SetExchangeSession(HNX, OPEN1) # Set session on Exchange is Open
SetGatewaySession(HNX, OPEN1) # Set session on Gateway is Open
SetORSSession(HNX, OPEN1) # Set sesison on ORS is Open
ClearExchange() # Clear all order on Exchange

ord1 = Place(0001000001, VND, Buy, 12000, 100)

ord2 = Place(0001000002, VND, Sell, 10000, 100)

ord1 = Place(0001000001, VND, Sell, 10000, 100)

ord2 = Place(0001000002, VND, Buy, 12000, 100)