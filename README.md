POST Sign Up: auth/signup

    headers: {"Content-Type": "application/json"}
  
    body: {name: _string_, email: _string_, password: _string_}
  
POST Sign In: auth/signin

    headers: { "Content-Type": "application/json" }
  
    body: { email: _string_, password: _string_ }
  
GET All Users: users

    headers: { "Authorization": `Bearer + ${_token_}` }

GET One User: users/:id

    headers: { "Authorization": `Bearer + ${_token_}` }
  
PATCH users/:id

    headers: { "Authorization": `Bearer + ${_token_}` }
    
DELETE users/:id

    headers: { "Authorization": `Bearer + ${_token_}` }
    
  
