const { expect } = require('chai');
const { suite, test } = require('mocha');
const chaiAsPromised = require( 'chai-as-promised' );
const chai = require("chai");
const request = require('supertest');
const fetch = require('node-fetch');
//maybe have array of possible methods
chai.use( chaiAsPromised )

const baseUrl = 'https://cmb-bagels-api.herokuapp.com'
// const { generateGETUrl, getDistance, filteredBagelData, filteredBagelDataDistance, filteredBagelDataMinAge, filteredBagelDataMaxAge } = require('../helper_functions')
const authorization = 'Basic Y21iOmJhZ2Vs'





// function generateTest( testEndpoint, testMethod, testAuthorization, testFilterParams = {}, testPostRequestBody) {
//   describe(`${testMethod} to ${baseUrl}${testEndpoint}` + (testAuthorization === authorization ?  ' with correct authorization' : ' with incorrect authorization'), () => {
//     describe(`${testMethod} ${testEndpoint} with` + (testAuthorization === authorization ? ' correct' : ' incorrect' ` authorization`), () => {
//
//       if (testAuthorization === authorization && testMethod === 'get') {
//       request(`${baseUrl}${testEndpoint}${generateGETUrl(testFilterParams.name, testFilterParams.gender, testFilterParams.dist, testFilterParams.origin, testFilterParams.min_age, testFilterParams.max_age, testFilterParams.limit, testFilterParams.offset)}`)
//       .get(testEndpoint)
//       .set('Accept', 'application/json')
//       .set('Authorization', testAuthorization)
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end((err, res) => {
//
//         describe('Response should all have correct properties ', () => {
//        test('Response body should be an array', (done) => {
//          expect(res.body).to.be.an('array');
//
//          done()
//        })
//
//        if (res.body.length >= 1) {
//          test('A bagel should be an object with all the expected keys', (done) => {
//            expect(res.body[0]).to.be.an('object').that.has.all.keys('id', 'name', 'age', 'gender', 'activity');
//            done()
//          })
//
//          test('Bagel\'s locations property should be an array', (done) => {
//            expect(res.body[0].locations).to.be.an('array');
//            done()
//          })
//
//          test('Bagel\'s locations property should have at least one element', (done) => {
//            expect(res.body[0].activity).to.have.lengthOf.above(0);
//            done()
//          })
//
//          test('A location should be an object with all the expected keys', (done) => {
//            expect(res.body[0].activity[0]).to.be.an('object').that.has.all.keys('name', 'coordinates');
//            done()
//          })
//
//          test('A location\'s coordinates should be an array of two existing coordinates', (done) => {
//            expect(res.body[0].activity[0].coordinates).to.be.an('array').that.has.lengthOf(2);
//            done()
//          })
//        }
//        })
//         console.log('IT WORKED!');
//
//       });
//     }
// })
// })
// }
test('aaaaaafdlkfjaslfj', (done) => {
  async function generateTest( testEndpoint, testMethod, testAuthorization, testFilterParams = {}, testPostRequestBody) {
    describe(`${testMethod} to ${baseUrl}${testEndpoint}` + (testAuthorization === authorization ?  ' with correct authorization' : ' with incorrect authorization'), () => {
      describe(`${testMethod} ${testEndpoint} with` + (testAuthorization === authorization ? ' correct' : ' incorrect authorization'), () => {

        if (authorization === testAuthorization && testMethod.toLowerCase() === 'get') {
        request(`${baseUrl}${generateGETUrl(testFilterParams.name, testFilterParams.gender, testFilterParams.dist, testFilterParams.origin, testFilterParams.min_age, testFilterParams.max_age, testFilterParams.limit, testFilterParams.offset)}`)
        .get(testEndpoint)
        .set('Accept', 'application/json')
        .set('Authorization', testAuthorization)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {

          describe('Response should all have correct properties ', () => {
         test('Response body should be an array', (done) => {
           expect(res.body).to.be.an('array');

           done()
         })

         if (res.body.length >= 1) {
           test('A bagel should be an object with all the expected keys', (done) => {
             expect(res.body[0]).to.be.an('object').that.has.all.keys('id', 'name', 'age', 'gender', 'activity');
             done()
           })

           test('Bagel\'s locations property should be an array', (done) => {
             expect(res.body[0].locations).to.be.an('array');
             done()
           })

           test('Bagel\'s locations property should have at least one element', (done) => {
             expect(res.body[0].activity).to.have.lengthOf.above(0);
             done()
           })

           test('A location should be an object with all the expected keys', (done) => {
             expect(res.body[0].activity[0]).to.be.an('object').that.has.all.keys('name', 'coordinates');
             done()
           })

           test('A location\'s coordinates should be an array of two existing coordinates', (done) => {
             expect(res.body[0].activity[0].coordinates).to.be.an('array').that.has.lengthOf(2);
             done()
           })
         }
         })
          done();
        });
      }

      if(testAuthorization === '') {
        test('All /bagels should receive 401 error response with absent authorization credentials', (done) => {
          request(baseUrl)
          .get(testEndpoint)
          .set('Accept', 'application/json')
          .set('Authorization', testAuthorization)
          .expect('Content-Type', /json/)
          .expect(401)
          .end((err, res) => {
            test('Authentication credentials were not provided.', (done) => {
              expect(res.body.detail).to.deep.equal({ detail: 'Authentication credentials were not provided.' });
              done()
            })
            done()
          })
        }).timeout(30000);
      }

      else if(testAuthorization !== authorization) {
        test('All /bagels routes should receive 401 error response with incorrect authorization credentials', (done) => {
          request(baseUrl)
          .get(testEndpoint)
          .set('Accept', 'application/json')
          .set('Authorization', '')
          .expect('Content-Type', /json/)
          .expect(401)
          .end((err, res) => {
            test('Authentication credentials were not provided.', (done) => {
              expect(res.body.detail).to.deep.equal({ "detail":"Invalid usernafdafsdafasfme/password." });
              done()
            })
            done()
          })
        }).timeout(30000);
      }


  })
  })
  }
generateTest('/bagels/', 'get', authorization, {})
generateTest('/bagels/', 'get', '', {})
generateTest('/bagels/', 'get', 'Basic fdsfdsfsadfdsaf', {})


}).timeout(30000);


function generateGETUrl(name, gender, dist, origin, minAge, maxAge, limit, offset) {
  let baseUrl2 = 'https://cmb-bagels-api.herokuapp.com/bagels/?'

  let nameParam = name ? `name=${name}&` : '';
  let genderParam = gender ? `gender=${gender}&` : '';
  let distParam = dist ? `dist=${dist}&` : '';
  let originParam = origin ? `origin=${origin}&` : '';
  let minAgeParam = minAge ? `minAge=${minAge}&` : '';
  let maxAgeParam = maxAge ? `maxAge=${maxAge}&` : '';
  let limitParam = limit ? `limit=${limit}&` : '';
  let offsetParam = offset ? `offset=${offset}&` : '';

  if (!`${nameParam}${genderParam}${distParam}${originParam}${minAgeParam}${maxAgeParam}${limitParam}${offsetParam}`) {
    return ''
  }

  return `?${nameParam}${genderParam}${distParam}${originParam}${minAgeParam}${maxAgeParam}${limitParam}${offsetParam}`.slice(0, -1);
}

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
