const axios=require("axios")

test('register',async()=>{

  //post to localhost:9000 , (username:test1,password:some password)
  ///response? {username:test1}
let res1=await axios.post("http://localhost:9000/api/auth/register",
{
  "username":"test13",
  "password":"12345"
})

  expect(res1.data.username).toBe("test13")

 

})

test('Not allow duplicate user name',async()=>{

  //post to localhost:9000 , (username:test1,password:some password)
  ///response? {username:test1}
let res1=await axios.post("http://localhost:9000/api/auth/register",
{
  "username":"test13",
  "password":"12345"
})

  expect(res1.data).toBe("Error:Duplicate user name")

 

})
