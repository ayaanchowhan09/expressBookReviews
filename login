curl.exe -sS -c q8-cookie.txt -X POST http://127.0.0.1:5000/customer/login -H "Content-Type: application/json" --data-raw '{"username":"aayanbookuser20260922","password":"BookPass2026!"}'

{"message":"User successfully logged in","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFheWFuYm9va3VzZXIyMDI2MDkyMiIsImlhdCI6MTc5MDAxNTczNywiZXhwIjoxNzkwMDE5MzM3fQ.3cjuFAlyeMOhjh6pfDOOI8kXUTA8dEABEAH7tgEJwTM"}
