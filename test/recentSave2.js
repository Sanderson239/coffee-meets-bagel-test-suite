const { expect } = require('chai');
const { suite, test } = require('mocha');
const chaiAsPromised = require( 'chai-as-promised' );
const chai = require("chai");
const request = require('supertest');
const fetch = require('node-fetch');
// chai.should();
// chai.use(require('chai-things'));
chai.use( chaiAsPromised )
// chai.use(require('chai-match'));

const { generateGETUrl, getDistance, filteredBagelData, filteredBagelDataDistance, filteredBagelDataMinAge, filteredBagelDataMaxAge } = require('../helper_functions')
const url = 'https://cmb-bagels-api.herokuapp.com'
const authorization = 'Basic Y21iOmJhZ2Vs'
const origin = {lat: 37.774929, lng: -122.419416};
const dist = 50;



describe.only('GET /bagels route', () => {
  describe('GET /bagels with correct authorization', () => {
    request(url)
    .get('/bagels/')
    .set('Accept', 'application/json')
    .set('Authorization', authorization)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {

      describe('Response should all have correct properties ', () => {
      test('Response body should be an array', (done) => {
        // it('it test', () => {
        expect(res.body).to.be.an('array');
        // expect(true).to.equal(false)
      // })
        done()
      })

      // it('Res.body should only contain objects', () => {
      //   expect(res.body).should.all.be.an('object')
      // })
    // })
      if (res.body.length >= 1) {
        test('A bagel should be an object with all the expected keys', (done) => {
          expect(res.body[0]).to.be.an('object').that.has.all.keys('id', 'name', 'age', 'gender', 'locations');
          done()
        })

        test('Bagel\'s locations property should be an array', (done) => {
          expect(res.body[0].locations).to.be.an('array');
          done()
          // important combine with length test below
        })

        test('Bagel\'s locations property should have at least one element', (done) => {
          expect(res.body[0].locations).to.have.lengthOf.above(0);
          done()
          // important combine with above
        })

        test('A location should be an object with all the expected keys', (done) => {
          expect(res.body[0].locations[0]).to.be.an('object').that.has.all.keys('name', 'coordinates');
          done()
        })

        test('A location\'s coordinates should be an array of two existing coordinates', (done) => {
          expect(res.body[0].locations[0].coordinates).to.be.an('array').that.has.lengthOf(2);
          // expect(res.body[0].activity[0].coordinates.length).to.have.lengthOf(2);
          done()
        })
      }
      })
      // done();
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


// For this test I was conflicted between two methods of testing the filter by
// name because there is no guarantee what data is contained in the database.
// One option was for me to make a POST request a bagel before the test so I
// know it should be there when I get it. The downside of this is that that
// would make these tests dependent on the success of my POST tests. The second
// option was to test for something I knew was in the database, the downside
// being that I couldn't be sure what is actually in the database. I ended up
// choosing the latter options because I like the tests to be as self contained
// as possible and I didn't want my tests success to be dependend on the success
// of unrelated tests.

// These tests that filter by name work regardless of if there is a bagel with
// the name 'Taylor Swift' in the database because they are checking that every
// element in the response body has the name 'Taylor Swift'. T

suite('GET /bagels filtering only by name', () => {
  test('Should return correct results for filtering by case sensitive name', (done) => {
    request(url)
      .get('/bagels/?name=Taylor%20Swift')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
    .end((err, res) => {
      // console.log(res.body);
      describe('fkldsfdslkfjs', () => {
      it('All results, if any, should have the name, Taylor Swift', () => {
        // important expect(res.body).should.all.have.property('name', '')
        // expect(res.body).should.all.have.property('name').that.matches(/taylor swift/i)
        expect(res.body).to.have.all.property('name', 'Taylor Swift');
      })
    })
      done();
    });
  }).timeout(30000);

  test('Should return correct results for filtering with lowercase name', (done) => {
    request(url)
      .get('/bagels/?name=taylor%20swift')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
        .end((err, res) => {

          let hasName = !res.body.some((ele, idx, arr) => {
            return (ele.name.toLowerCase() !== 'taylow swift');
          })

          describe('fkldsfdslkfjs', () => {
      it('All results, if any, should have the name, Taylor Swift', () => {
        // important expect(res.body).should.all.have.property('name', '')
        expect(hasName).to.equal(true);
      })
    })
      done();
    });
  }).timeout(30000);

  test('Should return correct results for filtering with mixed case name', (done) => {
    request(url)
      .get('/bagels/?name=taYLor%20swiFt')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
        .end((err, res) => {

          let hasName = !res.body.some((ele, idx, arr) => {
            return (ele.name.toLowerCase() !== 'taylow swift');
          })
          describe('fkldsfdslkfjs', () => {
        it('All results, if any, should have the name, Taylor Swift', () => {
          // important expect(res.body).should.all.have.property('name', '')
          expect(hasName).to.equal(true);
        })
      })
        done();
      });
  }).timeout(30000);
});

// test('get bagels by name should only contain results with matching name', (done) => {
//   request(url)
//   .get('/bagels/?name=Taylor%20Swift')
//   .set('Accept', 'application/json')
//   .set('Authorization', authorization)
//   .expect('Content-Type', /json/)
//   .end((err, res) => {
//     describe('Should have correct status for searching with a name', () => {
//       it('Should have 200 status', () => {
//         expect(res.status).to.equal(200);
//       })
//     })
//
//     res.body.forEach(bagel => {
//       describe('Results should all have matching name', () => {
//
//         it('should have name property', () => {
//           expect(bagel).to.have.property('name')
//         })
//
//         it('Should have a matching name', () => {
//           expect(bagel.name.toLowerCase()).to.equal('taylor swift')
//         })
//       })
//     })
//     done();
//   });
// }).timeout(30000);

test('GET /bagels results when filtering by name should not be missing any record with a matching name', (done) => {
  async function asyncNameTest() {
  let bagelData = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', {headers: {Authorization: authorization}})
  .then(response => {
      return response.json()
    })
      .then(data => {
        return data;
      })

  request(url)
  .get('/bagels/?name=Taylor%20Swift')
  .set('Accept', 'application/json')
  .set('Authorization', authorization)
  .expect('Content-Type', /json/)
  .expect(200)
  .end((err, res) => {
    describe('fkldsfdslkfjs', () => {
        it('All names that match should be in filter result', () => {
          expect(res.body).to.deep.include.members(filteredBagelData(bagelData, 'name', 'taylor swift'));
          })
        })
    done();
  });
}
asyncNameTest();
}).timeout(30000);



suite('GET /bagels filtering by only gender', () => {
  test('Should return correct results for filtering by male', (done) => {
    request(url)
      .get('/bagels/?gender=m')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      // .expect('Content-Type', /json/)
      // .expect(300)
      .end((err, res) => {
        // console.log(err, res);
        // This is returning an error because there is currently no
        // implementation of a filter by gender.
        describe('fkldsfdslkfjs', () => {
          it('All results, if any, should have the matching gender', () => {
            expect(res.body).should.all.have.property('gender', 'm')
            // important expect(res.body).should.all.have.property('gender').that.equals('m')
          })
            })
            done();
      })

  }).timeout(30000);

  test('Should return correct results for filtering by female', (done) => {
    request(url)
      .get('/bagels/?gender=f')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {

          describe('fkldsfdslkfjs', () => {

          it('All results, if any, should have the matching gender2', () => {
            expect(res.body).should.all.have.property('gender', 'f')
            // important expect(res.body).should.all.have.property('gender').that.equals('m')
          })
        })
        done();
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

// This test is aslo not working because there is currently no
// implementation of a filter by gender.

test('GET /bagels by gender should not be missing any record with a matching gender', (done) => {
  async function asyncGenderTest() {
  let bagelData = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', {headers: {Authorization: authorization}})
  .then(response => {
      return response.json()
    })
      .then(data => {
        return data;
      })

  request(url)
  .get('/bagels/?gender=m')
  .set('Accept', 'application/json')
  .set('Authorization', authorization)
  .expect('Content-Type', /json/)
  .expect(200)
  .end((err, res) => {
    describe('fkldsfdslkfjs', () => {

    it('All records with matching genders should be in filter result', () => {
      expect(res.body).to.deep.include.members(filteredBagelData(bagelData, 'gender', 'm'));
      })
    })
    done();
  });
}
asyncGenderTest();
}).timeout(30000);

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


//important change activity to locations

// This suite fails because the bagel property containing the locations is
// mislabled as 'activity'

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
            return ele.activity.some((ele, idx, arr) => {return getDistance(origin, {lat: ele.coordinates[0], lng: ele.coordinates[1]}) <= dist})
          })
          // important number 3 let withinDistance = bagel.activity.some((ele, idx, arr) => {return getDistance({lat: origin.lat, lng: origin.lng}, {lat: ele.coordinates[0], lng: ele.coordinates[1]}) <= dist})
          // bagel.activity.forEach(location => {

            // number 2 location.some((ele, idx, arr) => {return getDistance({lat: origin.lat, lng: origin.lng}, {lat: ele.coordinates[0], lng: ele.coordinates[1]}) <= dist})
            // if (getDistance({lat: origin.lat, lng: origin.lng}, {lat: location.coordinates[0], lng: location.coordinates[1]}) <= dist) {
            //   withinDistance = true;
            // }
          // })
          describe('fkldsfdslkfjs', () => {
          it('All records should have at least one location within the given distance of the origin', () => {
              expect(withinDistance).to.equal(true);
          })
        })
        done();
      });
  }).timeout(30000);

  test('GET /bagels by origin and distance should not be missing any record matching filter criteria', (done) => {

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
      // for (let i = 0, j = 0; i < bagelData.length; i++) {
      //   describe('All matching results based on origin and distance should be in the filter response', () => {
      //     bagelData[i].activity.forEach(location => {
      //       if (getDistance({lat: origin.lat, lng: origin.lng}, {lat: location.coordinates[0], lng: location.coordinates[1]}) <= dist) {
      //         expect(res.body).to.deep.include.members([bagelData[i]]);
      //       }
      //     })
      //   })
      // }
      describe('fkldsfdslkfjs', () => {
      it('All records with locations within distance of origin should be in filter result', () => {
        expect(res.body).to.deep.include.members(filteredBagelDataDistance(bagelData, origin, dist));
        })
      })
      done();
    });
  }
  asyncDistanceTest();
  }).timeout(30000);
});

// Post some things before each to test the age

suite('GET /bagels filtering by only min_age', () => {
  test('All records returned should be at or above the minimum age', (done) => {
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
        describe('fkldsfdslkfjs', () => {
        it('All results at or should be above the min_age', () => {
          expect(matchingAge).to.equal(true);
          // important expect(res.body).should.all.have.property('gender').that.equals('m')
        })
      })


        done();
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
      // for (let i = 0, j = 0; i < bagelData.length; i++) {
      //   describe('All matching age results should be in the filter response', () => {
      //     if (bagelData[i].age >= 27) {
      //     it ('All records with matching gender should be in filter result', () => {
      //       expect(res.body).to.deep.include.members([bagelData[i]]);
      //       })
      //     }
      //   })
      // }
      describe('fkldsfdslkfjs', () => {
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

suite('GET /bagels filtering by only max_age', () => {
  test('All records returned should be at or below the maximum age', (done) => {
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

        describe('fkldsfdslkfjs', () => {
        it('All results should be below the max_age', () => {
          expect(matchingAge).to.equal(true);
          // important expect(res.body).should.all.have.property('gender').that.equals('m')
        })
      })

        // res.body.forEach(bagel => {
        //   describe('Results should all have age property and age that is at or below 40', () => {
        //       expect(bagel).to.have.property('age')
        //       expect(bagel.age).to.be.at.most(40)
        //   })
        // })

        done();
      });
  }).timeout(30000);

  test('GET /bagels by maximum age should not be missing any record with a matching age', (done) => {
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
      // for (let i = 0, j = 0; i < bagelData.length; i++) {
      //   describe('All matching age results should be in the filter response', () => {
      //     if (bagelData[i].age <= 27) {
      //     it ('All records with matching gender should be in filter result', () => {
      //       expect(res.body).to.deep.include.members([bagelData[i]]);
      //       })
      //     }
      //   })
      // }
      // console.log('res.body', res.body);
      // console.log('filtered stuff', filteredBagelDataMaxAge(bagelData, 27));
      describe('fkldsfdslkfjs', () => {
      it('All records with ages at or below the max_age should be in filter result', () => {
        expect(res.body).to.deep.include.members(filteredBagelDataMaxAge(bagelData, 27));
        })
      })
      done();
    });
  }
  asyncMaxAgeTest();
  }).timeout(30000);
});

  // important While I only tested a limit request with a. I would make a test designed to return a count of 0 for this one.
  // or I could make more tests for limit requests that return either no results
suite('GET /bagels filtering by limit and offset', () => {
  test('The first records should be returned according to the given limit and offset', (done) => {
    request(url)
      .get('/bagels/?limit=2&offset=4')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        describe('fkldsfdslkfjs', () => {

        it('res.body should be an object with all the expected keys', () => {
          expect(res.body).to.be.an('object').that.has.keys('count', 'next', 'previous', 'results');
        })


        it('Res.body.results should be an array that only contains objects', () => {
          expect(res.body.results).to.be.an('array');
        })

        // it('Res.body.results should only contain objects', () => {
        //   expect(res.body.results).to.all.be.an('object');
        // })
      })


        if (res.body.count >= 6) {
          describe('fkldsfdslkfjs', () => {
          it('res.body\'s next property should be correct route', () => {
            expect(res.body.next).to.be.equal(`${url}/bagels/?limit=2&offset=6`);
          })

          it('res.body\'s previous property should be correct route', () => {
            expect(res.body.previous).to.be.equal(`${url}/bagels/?limit=2&offset=2`);
          })

          it('Bagel\'s results property should have two elements', () => {
            expect(res.body.results).to.have.lengthOf(2);
          })
        })
        }
        done();
      });
  }).timeout(30000);
});

// test that this return the correct two things. make assumption about first 2 things. maybe just add this in comment.

// talk about how I would do this in a proper staging environment with seed data
