const { expect } = require('chai');
const { suite, test } = require('mocha');
const chaiAsPromised = require( 'chai-as-promised' );
const chai = require("chai");
const request = require('supertest');
const fetch = require('node-fetch');
chai.should();
chai.use( chaiAsPromised )

const { generateGETUrl, getDistance, filteredBagelData, filteredBagelDataDistance, filteredBagelDataMinAge, filteredBagelDataMaxAge } = require('../helper_functions')
const url = 'https://cmb-bagels-api.herokuapp.com'
const authorization = 'Basic Y21iOmJhZ2Vs'
const origin = {lat: 37.774929, lng: -122.419416};
const dist = 50;



describe('GET /bagels route', () => {
  describe('GET /bagels with correct authorization', () => {
    request(url)
    .get('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', authorization)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {

      describe('GET /bagels response should all have correct properties', () => {
      test('Response body should be an array', (done) => {
        expect(res.body).to.be.an('array');
        done()
      })


      if (res.body.length >= 1) {
        test('A bagel should be an object with all the expected keys', (done) => {
          expect(res.body[0]).to.be.an('object').that.has.all.keys('id', 'name', 'age', 'gender', 'locations');
          done()
        })

        test('Bagel\'s locations property should be an array', (done) => {
          expect(res.body[0].locations).to.be.an('array');
          done()
        })

        test('Bagel\'s locations property should have at least one element', (done) => {
          expect(res.body[0].locations).to.have.lengthOf.above(0);
          done()
        })

        test('A location should be an object with all the expected keys', (done) => {
          expect(res.body[0].locations[0]).to.be.an('object').that.has.all.keys('name', 'coordinates');
          done()
        })

        test('A location\'s coordinates should be an array of two existing coordinates', (done) => {
          expect(res.body[0].locations[0].coordinates).to.be.an('array').that.has.lengthOf(2);
          done()
        })
      }
      })
    });
  }).timeout(30000);

  test('All /bagels routes should receive 401 error response with incorrect authorization credentials', (done) => {
    request(url)
    .get('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic asfsdfsdfasd')
    .expect('Content-Type', /json/)
    .expect(401, { "detail":"Invalid username/password." }, done);
  }).timeout(30000);

  test('All /bagels should receive 401 error response with absent authorization credentials', (done) => {
    request(url)
    .get('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', '')
    .expect('Content-Type', /json/)
    .expect(401, { detail: 'Authentication credentials were not provided.' }, done);
  }).timeout(30000);
});


describe('GET /bagels filtering by only gender', () => {
  describe('Should return correct results for filtering by male', () => {
    request(url)
      .get('/bagels/?gender=m')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .end((err, res) => {
        describe('GET /bagels filtering by male', () => {
          test('All results, if any, should be male', (done) => {
            expect(res.body).should.all.have.property('gender', 'm')
            done()
          })
            })
      })

  }).timeout(30000);

  describe('Should return correct results for filtering by female', () => {
    request(url)
      .get('/bagels/?gender=f')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {

          describe('GET /bagels filtering by female', () => {

          test('All results, if any, should be female', (done) => {
            expect(res.body).should.all.have.property('gender', 'f')
            done()
           })
        })
      });


  }).timeout(30000);

  test('Should not be able to search by other gender', (done) => {
    request(url)
      .get('/bagels/?gender=l')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(400, done)
  }).timeout(30000);
});



suite('GET /bagels filtering by only distance', () => {
  test('Should return all records when filtering only by distance, same as a GET all request', (done) => {
    request(url)
      .get('/bagels/?dist=100')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200, done)
  }).timeout(30000);
});

suite('GET /bagels filtering by only origin', () => {
  test('Should return all records when filtering only by origin, same as a GET all request', (done) => {
    request(url)
      .get('/bagels/?origin=100')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200, done)
  }).timeout(30000);
});


// This suite fails because the bagel property containing the locations is
// mislabled as 'activity' when it should be 'locations'

suite('GET /bagels filtering by origin and distance', () => {
  test('All results, if any, should have at lease one location within the given distance of the origin when filtering by origin and distance', (done) => {
    request(url)
      .get(`/bagels/?dist=${dist}&origin=${origin.lat},${origin.lng}`)
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
          let withinDistance = res.body.some((ele, idx, arr) => {
            return ele.locations.some((ele, idx, arr) => {return getDistance(origin, {lat: ele.coordinates[0], lng: ele.coordinates[1]}) <= dist})
          })
          // important number 3 let withinDistance = bagel.activity.some((ele, idx, arr) => {return getDistance({lat: origin.lat, lng: origin.lng}, {lat: ele.coordinates[0], lng: ele.coordinates[1]}) <= dist})
          // bagel.activity.forEach(location => {

            // number 2 location.some((ele, idx, arr) => {return getDistance({lat: origin.lat, lng: origin.lng}, {lat: ele.coordinates[0], lng: ele.coordinates[1]}) <= dist})
            // if (getDistance({lat: origin.lat, lng: origin.lng}, {lat: location.coordinates[0], lng: location.coordinates[1]}) <= dist) {
            //   withinDistance = true;
            // }
          // })
          describe('GET /bagels by origin and distance', () => {
          it('All records should have at least one location within the given distance of the origin', () => {
              expect(withinDistance).to.equal(true);
          })
        })
        done();
      });
  }).timeout(30000);

  test('', (done) => {

    async function asyncDistanceTest() {
    let bagelData = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', {headers: {Authorization: authorization}})
    .then(response => {
        return response.json()
      })
        .then(data => {
          return data;
        })
    request(url)
    .get(`/bagels/?dist=${dist}&origin=${origin.lat},${origin.lng}`)
    .set('Accept', 'application/json')
    .set('Authorization', authorization)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      describe('GET /bagels filtering by origin and distance', () => {
      it('All records with locations within distance of origin should also be in filter result', () => {
        expect(res.body).to.deep.include.members(filteredBagelDataDistance(bagelData, origin, dist));
        })
      })
      done();
    });
  }
  asyncDistanceTest();
  }).timeout(30000);
});

describe('GET /bagels filtering by only min_age', () => {
  describe('All records returned should be at or above the minimum age', () => {
    request(url)
      .get('/bagels/?min_age=21')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {

        let matchingAge = res.body.some((ele, idx, arr) => {
          return !ele.age < 27;
        })

        // res.body.forEach(bagel => {
        //   describe('Results should all have age property and age that is at or above 27', () => {
        //       expect(bagel).to.have.property('age')
        //       expect(bagel.age).to.be.at.least(27)
        //   })
        // })
        describe('GET /bagels filtering by min_age', () => {
        test('All results at or should be above the min_age', (done) => {
          expect(matchingAge).to.equal(true);
          done()
          // important expect(res.body).should.all.have.property('gender').that.equals('m')
        })
      })


      });
  }).timeout(30000);

  test('GET /bagels by minimum age should not be missing any record with a matching age', (done) => {
    async function asyncMinAgeTest() {
    let bagelData = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', {headers: {Authorization: authorization}})
    .then(response => {
        return response.json()
      })
        .then(data => {
          return data;
        })
    request(url)
    .get('/bagels/?min_age=27')
    .set('Accept', 'application/json')
    .set('Authorization', authorization)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      describe('GET /bagels filtering by min_age', () => {
      it('All records with ages at or above the min_age should be in filter result', () => {
        expect(res.body).to.deep.include.members(filteredBagelDataMinAge(bagelData, 27));
        })
      })
      done();
    });
  }
  asyncMinAgeTest();
  }).timeout(30000);
});

describe('GET /bagels filtering by only max_age', () => {
  describe('All records returned should be at or below the max_age', () => {
    request(url)
      .get('/bagels/?max_age=40')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        let matchingAge = res.body.some((ele, idx, arr) => {
          return !(ele.age > 40);
        })

        describe('GET /bagels filtering by min_age', () => {
        test('All results should be at or below the max_age', (done) => {
          expect(matchingAge).to.equal(true);
          done()
        })
      })


      });
  }).timeout(30000);
});

test('', (done) => {
  async function asyncMaxAgeTest() {
  let bagelData = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', {headers: {Authorization: authorization}})
  .then(response => {
      return response.json()
    })
      .then(data => {
        return data;
      })
  request(url)
  .get('/bagels/?max_age=27')
  .set('Accept', 'application/json')
  .set('Authorization', authorization)
  .expect('Content-Type', /json/)
  .expect(200)
  .end((err, res) => {
    describe('GET /bagels by maximum age should not be missing any record with a matching age', () => {
    it('All records with ages at or below the max_age should be in filter result', () => {
      expect(res.body).to.deep.include.members(filteredBagelDataMaxAge(bagelData, 27));
      })
    })
    done();
  });
}
asyncMaxAgeTest();
}).timeout(30000);


describe('GET /bagels filtering by limit and offset', () => {
  describe('The first records should be returned according to the given limit and offset', () => {
    request(url)
      .get('/bagels/?limit=2&offset=4')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        describe('GET /bagels by limit and offset', () => {

        test('Res.body should be an object with all the expected keys', (done) => {
          expect(res.body).to.be.an('object').that.has.keys('count', 'next', 'previous', 'results');
          done()
        })


        test('Res.body.results should be an array that only contains objects', (done) => {
          expect(res.body.results).to.be.an('array');
          done()
        })
      })


        if (res.body.count >= 6) {
          describe('GET /bagels by limit and offset should return object with correct properties', () => {
          test('res.body\'s next property should be correct route', (done) => {
            expect(res.body.next).to.be.equal(`${url}/bagels/?limit=2&offset=6`);
            done()
          })

          test('res.body\'s previous property should be correct route', (done) => {
            expect(res.body.previous).to.be.equal(`${url}/bagels/?limit=2&offset=2`);
            done()
          })

          test('Bagel\'s results property should have two elements', (done) => {
            expect(res.body.results).to.have.lengthOf(2);
            done()
          })
        })
        }
      });
  }).timeout(30000);
});
