import fetch from 'node-fetch';

async function fetchHotelSummaries() {
  const response = await fetch('https://svc-seeker.k8.prd.hyattsys.net/v1/search/hotelsummaries?locale=en-US&query=Portugal&startDate=2023-04-27&endDate=2023-04-29');
  const data = await response.json();
  return data;
}

async function createPropertyJson() {
  const hotelSummaries = await fetchHotelSummaries();
  const propertyJson = {
    "page": "/search",
    "channel": "web",
    "guest": {},
    "session": {},
    "search": {
      "searchTerm": "Portugal",
      "arrivalDate": "2023-04-27",
      "departureDate": "2023-04-29",
      "usePoints": null,
      "numRooms": 1,
      "accessible": false,
      "numAdults": 1,
      "numChildren": 0
    },
    "hotelSummaries": hotelSummaries
  };
  console.log(JSON.stringify(propertyJson));
  // fs.writeFileSync('output.json', JSON.stringify(propertyJson));
}

createPropertyJson();

