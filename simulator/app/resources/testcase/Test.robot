SetExchangeSession(OPEN)
SetGatewaySession(NEW)
SetORSSession(NEW)

Place(2, AAA, Sell, 2000, 100)
Place(1, AAA, Buy, 2000, 100)

OpenORS()
OpenGateway()
ResetAccounts()