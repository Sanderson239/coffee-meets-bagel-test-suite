const { expect } = require('chai');
const { should } = require('should')
const { all, something, that, include } = require('chai-things');
const { suite, test, describe, it } = require('mocha');
const request = require('supertest');
const { generateGETUrl } = require('../helper_functions')
const fetch = require('node-fetch');
const url = 'https://cmb-bagels-api.herokuapp.com'
const chai = require("chai");
chai.use(require('chai-things'));

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
// element in the response body has the name 'Taylor Swift'.

test('get bagels by name should only contain results with matching name', (done) => {
  request(url)
  .get('/bagels/?name=taylor%20swift')
  .set('Accept', 'application/json')
  .set('Authorization', 'Basic Y21iOmJhZ2Vs')
  .end((err,res) => {
    describe('Should have correct status', () => {
      it('Should have 200 status', () => {
        expect(res.status).to.equal(200);
      })
    })

    res.body.forEach(bagel => {
      describe('Results should all have matching name', () => {

        it('should have name property', () => {
          expect(bagel).to.have.property('name')
        })

        it('Should have a matching name', () => {
          expect(bagel.name.toLowerCase()).to.equal('taylor swift')
        })
      })
    })
    done();
  });
});

test('Should return correct results for filtering by male', (done) => {
  request(url)
    .get('/bagels/?gender=m')
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic Y21iOmJhZ2Vs')
    .end((err,res) => {
      describe('Should have correct status', () => {
        it('Should have 200 status', () => {
          expect(res.status).to.equal(200);
        })
      })

      res.body.forEach(bagel => {
        describe('Results should all have matching gender', () => {

          it('should have gender property', () => {
            expect(bagel).to.have.property('gender')
          })

          it('Should have a matching gender', () => {
            expect(bagel.gender.toLowerCase()).to.equal('gender')
          })
        })
      })
      done();
    });
});

suite('GET bagels filtering by only max_age', () => {
  test('All records returned should be at or below the maximum age', (done) => {
    request(url)
      .get('/bagels/?max_age=40')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic Y21iOmJhZ2Vs')
      .end((err,res) => {
        describe('Should have correct status', () => {
          it('Should have 200 status', () => {
            expect(res.status).to.equal(200);
          })
        })
        console.log(res.body);

        res.body.forEach(bagel => {
          describe('Results should all have age property and age that is at or below 40', () => {
              expect(bagel).to.have.property('age')
              expect(bagel.age).to.be.at.most(40)
          })
        })

        done();
      });
  });
});

suite('GET bagels filtering by only limit', () => {
  test('The first records should be returned according to the given limit', (done) => {
    request(url)
      .get('/bagels/?limit=2')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic Y21iOmJhZ2Vs')
      .end((err,res) => {
        describe('Should have correct status', () => {
          it('Should have 200 status', () => {
            expect(res.status).to.equal(200);
          })
        })
        expect(res.body.results.length).to.equal(2)
        done();
      });
  });
});

test('get bagels by name should contain all the records with the matching name', (done) => {
  async function asyncNameTest() {
  let bagelData = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', {headers: {Authorization: 'Basic Y21iOmJhZ2Vs'}})
  .then(response => {
      return response.json()
    })
      .then(data => {
        return data;
      })

  request(url)
  .get('/bagels/?name=Taylor%20Swift')
  .set('Accept', 'application/json')
  .set('Authorization', 'Basic Y21iOmJhZ2Vs')
  .end((err,res) => {
    describe('Should have correct status', () => {
      it('Should have 200 status', () => {
        expect(res.status).to.equal(200);
      })
    })

    for (let i = 0, j = 0; i < bagelData.length; i++) {
      describe('All matching results should be in the filter response', () => {
        if(bagelData[i].name.toLowerCase() === 'taylor swift') {
        it('Matching names should be in filter result', () => {
            console.log('name', bagelData[i].name)
            expect(res.body).to.deep.include.members([bagelData[i]]);
          })
        }

      })
    }
    done();
  });
}
asyncNameTest();
}).timeout(10000);

test('get bagels by maximum age should not be missing any record with a matching age', (done) => {
  async function asyncMaxAgeTest() {
  let bagelData = await fetch('https://cmb-bagels-api.herokuapp.com/bagels/', {headers: {Authorization: 'Basic Y21iOmJhZ2Vs'}})
  .then(response => {
      return response.json()
    })
      .then(data => {
        return data;
      })
  request(url)
  .get('/bagels/?max_age=27')
  .set('Accept', 'application/json')
  .set('Authorization', 'Basic Y21iOmJhZ2Vs')
  .end((err,res) => {
    for (let i = 0, j = 0; i < bagelData.length; i++) {
      describe('All matching age results should be in the filter response', () => {
        if (bagelData[i].age <= 27) {
        it ('All records with matching gender should be in filter result', () => {
          expect(res.body).to.deep.include.members([bagelData[i]]);
          })
        }
      })
    }
    done();
  });
}
asyncMaxAgeTest();
}).timeout(30000);
