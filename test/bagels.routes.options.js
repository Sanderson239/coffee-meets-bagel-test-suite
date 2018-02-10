const { expect } = require('chai');
const { suite, test } = require('mocha');
const request = require('supertest');
const url = 'https://cmb-bagels-api.herokuapp.com'

suite('OPTIONS request for /bagels route', () => {
  test('Should receive 200 response after OPTIONS request to /bagels', (done) => {
    request(url)
    .options('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });

  test('Should receive 401 error response for incorrect authorization credentials after OPTIONS request to /bagels route', (done) => {
    request(url)
    .options('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic asfsdfsdfasd')
    .expect('Content-Type', /json/)
    .expect(401, {"detail":"Invalid username/password."}, done);
  });
});
