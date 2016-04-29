ClearExchange()
ResetAccounts()
SetSession(HOSE, OPEN1)

ord1= Place(0001000001, SSI, Buy, ATC, 0, 100)
ord2= Place(0001000004, SSI, Buy, LO, 21000, 20)

ord3= Place(0001000003, SSI, Sell, LO, 21000, 10)
ord4= Place(0001000002, SSI, Sell, ATC, 0, 20)

SetSession(HOSE, ATC)
SetSession(HOSE, PT)
