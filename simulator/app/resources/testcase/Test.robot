SetExchangeSession(OPEN)
SetGatewaySession(OPEN)
SetORSSession(OPEN)

ord1 = Place(1, AAA, Buy, 2000, 100)

SetGatewaySession(NEW)

ord3 = Place(2, AAA, Sell, 2000, 100)
ord2 = Replace(ord1.msg, 2000, 200)

SetGatewaySession(OPEN)

ResetAccounts()