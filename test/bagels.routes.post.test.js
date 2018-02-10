const { expect } = require('chai');
const { suite, test } = require('mocha');
const request = require('supertest');
const { generateGETUrl } = require('../helper_functions')
const fetch = require('node-fetch');
const url = 'https://cmb-bagels-api.herokuapp.com';



// I had to make this test an async function becasue the only way for me to know
// what the correct response id of the post request is was to GET it before the
// test runs. This is testing that the new id is the max id of the bagel set + 1.

// On a second thought, maybe I overthought this one a bit. If we
// weren't interested in testing what the new id is specifically, another option
// would be to simply test that an id exists in the response object and that it
// is a Number.

suite('POST route', () => {
  test('Should receive 201 response and correct return data', (done) => {
    async function asyncResponseTest() {
    let newId = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', {headers: {Authorization: 'Basic Y21iOmJhZ2Vs'}})
    .then(response => {
        return response.json()
      })
        .then(data => {
          return data[data.length - 1].id + 1
        })

    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name":"New Bagel",
      "age":50,
      "gender":"f",
      "locations":[
        {
          "name":"San Francisco, CA","coordinates": [
            37.8044,
            -122.2711
          ]
        }
      ]
    })
    .expect(201, {
      "id": newId,
      "name": "New Bagel",
      "age": 50,
      "gender": "f",
      "activity": [
        {
          "name":"San Francisco, CA",
          "coordinates": [
            37.8044,
            -122.2711
          ]
        }
      ]
    }, done);
  }

  asyncResponseTest();
  });

  test('Should receive 400 error response for POST request with no name', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "age": 40,
      "gender": "f",
      "locations": [
        {

        }
      ]
    })
    .expect('Content-Type', /plain/)
    .expect(400, done);

  });

  test('Should receive 400 error response for POST request with no age', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "gender": "f",
      "locations": [
        {
          "name": "Vancouver, BC","coordinates": [
            49.2827,
            -123.1207
          ]
        }
      ]
    })
    .expect(400, done);

  });

  test('Should receive 400 error response for POST request with no gender', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age": 40,
      "locations": [
        {
          "name":"Vancouver, BC","coordinates": [
            49.2827,
            -123.1207
          ]
        }
      ]
    })
    .expect(400, done);

  });

  test('Should receive 400 error response for POST request with no locations', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age": 40,
      "gender":"f",
      "locations":[
      ]
    })
    .expect(400, done);
  });

  test('Should receive 400 error response for POST request with wrong gender', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age": 40,
      "gender": "a",
      "locations": [
        {
          "name": "Vancouver, BC","coordinates": [
            49.2827,
            -123.1207
          ]
        }
      ]
    })
    .expect(400, done);
  });

  test('Should receive 400 error response for POST request with wrong age', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age": 100,
      "gender":"m",
      "locations":[
        {
          "name":"Vancouver, BC","coordinates": [
            49.2827,
            -123.1207
          ]
        }
      ]
    })
    .expect(400, done);
  });

  test('Should receive 400 error response for POST request with wrong age', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age": 17,
      "gender":"m",
      "locations":[
        {
          "name":"Vancouver, BC","coordinates": [
            49.2827,
            -123.1207
          ]
        }
      ]
    })
    .expect(400, done);
  });

  test('Should receive 400 error response for POST request with missing coordinates for location', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age":40,
      "gender":"m",
      "locations":[
        {
          "name":"Vancouver, BC","coordinates": [

          ]
        }
      ]
    })
    .expect(400, done);
  });

  test('Should receive 400 error response for POST request with location missing name', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age":40,
      "gender":"m",
      "locations":[
        {
           "coordinates": [
            49.2827,
            -123.1207
          ]
        }
      ]
    })
    .expect(400, done);
  });

  test('Should receive 400 error response for POST request with missing coordinates for location', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age":40,
      "gender":"m",
      "locations":[
        {
          "name":"Vancouver, BC", "coordinates": [

          ]
        }
      ]
    })
    .expect(400, done);
  });

  test('Should receive 400 error response for POST request with impossible lat/long coordinates', (done) => {
    request(url)
    .post('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .send({
      "name": "New Bagel",
      "age":40,
      "gender":"m",
      "locations":[
        {
          "name":"Vancouver, BC", "coordinates": [
            181,
            -423.1207
          ]
        }
      ]
    })
    .expect(400, done);
  });


  // This test would have been different if there was a GET bagel by id route
  // This workaround passes the test, but gives me an unhandled promise
  // rejection message.

  // test.only('POST bagels should add a bagel and it can be found with a GET request', (done) => {
  //   async function asyncGetTest() {
  //   let newId = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', { headers: {Authorization: 'Basic Y21iOmJhZ2Vs'}})
  //   .then(response => {
  //       return response.json()
  //       .then(data => {
  //         return data[data.length - 1].id + 1
  //       })
  //   })
  //
  //
  //
  //   request(url)
  //   .post('/bagels/')
  //   .set('Accept', 'application/json')
  //   .set('Authorization', 'Basic Y21iOmJhZ2Vs')
  //   .send({
  //     "name":"Final Bagel",
  //     "age": 50,
  //     "gender":"f",
  //     "locations":[
  //       {
  //         "name":"Vancouver, BC","coordinates": [
  //           49.2827,
  //           -123.1207
  //         ]
  //       }
  //     ]
  //   })
  //   .expect(201, done)
  //
  //   let lastBagel = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', { headers: {Authorization: 'Basic Y21iOmJhZ2Vs'}})
  //   .then(response => {
  //       return response.json()
  //         })
  //       .then(data => {
  //         return data[data.length - 1]
  //       })
  //
  //   expect(lastBagel).to.equal({
  //     "id": newId,
  //     "name": "Final Bagel",
  //     "age": 50,
  //     "gender": "f",
  //     "activity": [
  //       {
  //         "name":"Vancouver, BC",
  //         "coordinates": [
  //           49.2827,
  //           -123.1207
  //         ]
  //       }
  //     ]
  //   })
  // }
  // asyncGetTest();
  // done()
  // });
});
