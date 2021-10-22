const request = require('supertest');
const {startMongo,disconnectMongo} = require('../../../services/mongo');
const app = require('../../app');

describe('Testing all Launches',()=>{
  beforeAll(async ()=>{
    await startMongo();
  })

  afterAll(async ()=>{
    await disconnectMongo();
  })
  describe('Test GET /launches',()=>{
    test('It should respond with 200 success',async ()=>{
      const response = await request(app).get('/v1/launches').expect('Content-Type',/json/).expect(200);
      //expect(response).toBe(200);
    })
  });
  
  describe('Test POST /launches',()=>{
    const completeLaunchData = {
      mission:'exo',
      target:'INS',
      rocket:'INS',
      launchDate:'JANUARY 12,2028'
    }
    const launchDataWithoutDate = {
      mission:'exo',
      target:'INS',
      rocket:'INS'
    }
    const completeLaunchDataIncorrectDate = {
      mission:'exo',
      target:'INS',
      rocket:'INS',
      launchDate:'test'
    }
    test('It should respond with 201 created',async ()=>{
      const response = await request(app)
      .post('/v1/launches')
      .send(completeLaunchData)
      .expect('Content-Type',/json/).expect(201);
  
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate);
  
      expect(response.body).toMatchObject(launchDataWithoutDate);
      //expect(response).toBe(200);
    });
  
    test('It should respond with 400 error',async ()=>{
      const response = await request(app)
      .post('/v1/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type',/json/).expect(400);
  
      expect(response.body).toStrictEqual({
        error:"missing required launch property"
      });
    });
  
    test('It should respond with 400 error',async ()=>{
      completeLaunchData.launchDate = "test"
      const response = await request(app)
      .post('/v1/launches')
      .send(completeLaunchDataIncorrectDate)
      .expect('Content-Type',/json/).expect(400);
  
      expect(response.body).toStrictEqual({
        error:"invalid Date"
      });
    });
  });
})

