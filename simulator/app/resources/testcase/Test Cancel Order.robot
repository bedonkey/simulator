OpenExchange()
OpenGateway()
OpenORS()
ClearExchange()
result = Place(1, AAA, Buy, 2000, 100)
Assert(result.status, true)

result1 = Cancel(result.msg)
Assert(result1.status, true)

result2 = Cancel(result.msg)
Assert(result2.msg, Order not found)

result = Place(1, BBB, Buy, 2000, 100)
Assert(result.status, true)

result1 = Cancel(result.msg)
Assert(result1.status, true)

ResetAccounts()