const { expect } = require('chai');
const { suite, test } = require('mocha');
const chaiAsPromised = require( 'chai-as-promised' );
const chai = require("chai");
// const chai2 = require("chai");
const request = require('supertest');
const fetch = require('node-fetch');
chai.should();
chai.use(require('chai-things'));
chai.use( chaiAsPromised )
chai.use(require('chai-match'));

const { generateGETUrl, getDistance, filteredBagelData, filteredBagelDataDistance, filteredBagelDataMinAge, filteredBagelDataMaxAge } = require('../helper_functions')
const url = 'https://cmb-bagels-api.herokuapp.com'
const authorization = 'Basic Y21iOmJhZ2Vs'
const origin = {lat: 37.774929, lng: -122.419416};
const dist = 50;

describe('GET /bagels filtering only by name', () => {
  test('Should not return incorrect results for filtering by case sensitive name', (done) => {
    request(url)
      .get('/bagels/?name=Taylor%20Swift')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
    .end((err, res) => {
      // console.log(res.body);
      describe('Taylor Swift', () => {
      it('All results, if any, should have the name, Taylor Swift', () => {
        // important expect(res.body).should.all.have.property('name', '')
        // expect(res.body).should.all.have.property('name').that.matches(/taylor swift/i)
        expect(res.body).to.have.all.property('name', 'Taylor Swift');
      })
    })
      done();
    });
  }).timeout(30000);

  test('Should not return incorrect results for filtering with lowercase name', (done) => {
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

          describe('Lowercase name', () => {
      it('All results, if any, should have the name, Taylor Swift', () => {
        // important expect(res.body).should.all.have.property('name', '')
        expect(hasName).to.equal(true);
      })
    })
      done();
    });
  }).timeout(30000);

  test('Should not return incorrect results for filtering with mixed case name', (done) => {
    request(url)
      .get('/bagels/?name=taYLor%20swiFt')
      .set('Accept', 'application/json')
      .set('Authorization', authorization)
      .expect('Content-Type', /json/)
      .expect(200)
        .end((err, res) => {

          let hasName = !res.body.some((ele, idx, arr) => {
            return (ele.name.toLowerCase() !== 'Taylor Swift');
          })
          describe('Mixed case name', () => {
        it('All results, if any, should have the name, Taylor Swift', () => {
          // important expect(res.body).should.all.have.property('name', '')
          expect(hasName).to.equal(true);
        })
      })
        done();
      });
  }).timeout(30000);

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
      describe('Contains all matching names', () => {
          it('All names that match should be in filter result', () => {
            expect(res.body).to.deep.include.members(filteredBagelData(bagelData, 'name', 'taylor swift'));
            })
          })
      done();
    });
  }
  asyncNameTest();
  }).timeout(30000);

  test('', (done) => {
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
      describe('Results should have all records with the matching gender', () => {

      it('All records with matching genders should be in filter result', () => {
        expect(res.body).to.deep.include.members(filteredBagelData(bagelData, 'gender', 'm'));
        })
      })
      done();
    });
  }
  asyncGenderTest();
  }).timeout(30000);
});
