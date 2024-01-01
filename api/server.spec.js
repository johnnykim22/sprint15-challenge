const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret =  "shh";
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, secret, options);
}


beforeAll(async () => {
 
  await db.migrate.rollback() // so any changes to migration files are picked up
  await db.migrate.latest()

   

})

beforeEach(async () => {
  //await db('users').truncate()
})
afterAll(async () => {
   // Truncate users table (faster than delete)
   await db('users').truncate();

   // Or delete all rows
  await db('users').del();
  
})




describe('Authentication Endpoints', () => {
  it('register new user succesfully', async () => {
    const saltRounds =  8;
    const hash = await bcrypt.hash("test1", saltRounds);

    const res = await request(server).post('/api/auth/register').send({username:"test1",password:"test1"})
   // expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('test1')
   // expect(res.body.password).toBe('test1')
  })

  it('register failed 1 (Invalid username', async () => {
    const saltRounds =  8;
    const hash = await bcrypt.hash("test1", saltRounds);

    const res = await request(server).post('/api/auth/register').send({password:"test1"})
   // expect(res.body.id).toBe(1)
    expect(res.body.message).toBe('username and password required')
    expect(res.status).toBe(400)
   // expect(res.body.password).toBe('test1')
  })


  it('allow user to log in succesfully', async () => {
  
    const res = await request(server).post('/api/auth/login').send({username:"test1",password:"test1"})
    const token = generateToken({id:1,username:"test1"})
 
    expect(res.body.message).toBe('welcome, test1')

    expect(res.body.token).toBe(token)
  })


  
});
describe('Jokes', () => {
  it('register new user succesfully', async () => {
    const saltRounds =  8;
    const hash = await bcrypt.hash("test1", saltRounds);

    const res = await request(server).post('/api/auth/register').send({username:"test1",password:"test1"})
   // expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('test1')
   // expect(res.body.password).toBe('test1')
  })

  it('register failed 1 (Invalid username', async () => {
    const saltRounds =  8;
    const hash = await bcrypt.hash("test1", saltRounds);

    const res = await request(server).post('/api/auth/register').send({password:"test1"})
   // expect(res.body.id).toBe(1)
    expect(res.body.message).toBe('username and password required')
    expect(res.status).toBe(400)
   // expect(res.body.password).toBe('test1')
  })


  it('allow user to log in succesfully', async () => {
  
    const res = await request(server).post('/api/auth/login').send({username:"test1",password:"test1"})
    const token = generateToken({id:1,username:"test1"})
 
    expect(res.body.message).toBe('welcome, test1')

    expect(res.body.token).toBe(token)
  })

  
});