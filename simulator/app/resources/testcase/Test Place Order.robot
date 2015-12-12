OpenExchange()
result = Place(1, AAA, Buy, 5000, 100)
Assert(result.msg, Price must lower than ceil price)

result = Place(1, AAA, Buy, 500, 100)
Assert(result.msg, Price must larger than floor price)

result = Place(123, AAA, Buy, 2000, 100)
Assert(result.msg, Account not exist)

result = Place(1, XXX, Buy, 2000, 100)
Assert(result.msg, Symbol not exist)

result = Place(1, AAA, Buy, 2000, 100000)
Assert(result.msg, Don't enough balance)

result = Place(1, AAA, Sell, 2000, 10000)
Assert(result.msg, Don't enough trade)

ord1 = Place(1, AAA, Buy, 2000, 100)
Assert(ord1.status, true)

result = Cancel(ord1.msg)
Assert(result.status, true)

ResetAccounts()