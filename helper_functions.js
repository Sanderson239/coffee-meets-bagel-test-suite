'use strict';

const fetch = require('node-fetch');

// This generateGETUrl function will take the values of parameters given as input
// values and generate a GET url with those specific parameters.

// I created this function so that I could eventually write a test suite
// where I have a given set of information and then I write a loop
// to automatically make tests for all 256 possible combinations of parameters
// for GET queries, but I did not manage to finish that in the time permitting.

function generateGETUrl(name, gender, dist, origin, minAge, maxAge, limit, offset) {
  let baseUrl = 'https://cmb-bagels-api.herokuapp.com/bagels/?'

  let nameParam = name ? `name=${name}&` : '';
  let genderParam = gender ? `gender=${gender}&` : '';
  let distParam = dist ? `dist=${dist}&` : '';
  let originParam = origin ? `origin=${origin}&` : '';
  let minAgeParam = minAge ? `minAge=${minAge}&` : '';
  let maxAgeParam = maxAge ? `maxAge=${maxAge}&` : '';
  let limitParam = limit ? `limit=${limit}&` : '';
  let offsetParam = offset ? `offset=${offset}&` : '';

  return `${baseUrl}${nameParam}${genderParam}${distParam}${originParam}${minAgeParam}${maxAgeParam}${limitParam}${offsetParam}`.slice(0, -1);
}

function generateTest(baseUrl, endpoint, method, authorization, filterParams, postRequestBody) {
    
}

// These function use the Haversine formula to calculate the distance between
// two point based on lattitude and longitude

  function rad(x) {
    return x * Math.PI / 180;
  };

  function getDistance(p1, p2) {
    let R = 6378137;
    let dLat = rad(p2.lat - p1.lat);
    let dLong = rad(p2.lng - p1.lng);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d / 1609.344;
  };

  function filteredBagelData(bagelData, urlParameter, urlArgument) {
    return bagelData.filter(bagel => {
      return bagel[urlParameter].toLowerCase() === `${urlArgument}`
    })
  }

  //important change activity to locations

  // This helper function currently does not work because the bagels
  // property containing the location is mislabled as 'activity'

  function filteredBagelDataDistance(bagelData, origin, dist) {
    return bagelData.filter(bagel => {
      return bagel.activity.some((ele, idx, arr) => {return getDistance({lat: origin.lat, lng: origin.lng}, {lat: ele.coordinates[0], lng: ele.coordinates[1]}) <= dist})
    })
  }

  function filteredBagelDataMinAge(bagelData, min_age) {
    return bagelData.filter(bagel => {
      return bagel.age > min_age;
    })
  }

  function filteredBagelDataMaxAge(bagelData, max_age) {
    // console.log(bagelData.filter(bagel => {
      // return bagel.age <= max_age;
    // }));
    return bagelData.filter(bagel => {
      return bagel.age <= max_age;
    })
  }




module.exports = {
  generateGETUrl,
  getDistance,
  filteredBagelData,
  filteredBagelDataDistance,
  filteredBagelDataMinAge,
  filteredBagelDataMaxAge,
};
