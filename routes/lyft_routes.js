const lyft = require('node-lyft');

let defaultClient = lyft.ApiClient.instance;

// Configure OAuth2 access token for authorization: Client Authentication
let clientAuth = defaultClient.authentications['Client Authentication'];
clientAuth.accessToken = '53sLC55TJrECVgGu3QVV8J6Qmxcxw8ZZRadEbTEnnubMPDnCmd8jOkfQtqcn8ioYzwi+cvs5S8m1dfCdf/nfrD7llee+a1dUTaaZxXgFR9n4kwgXckRmk4I=';

let apiInstance = new lyft.PublicApi();

let opts = { 
  'endLat': 37.7972, // Latitude of the ending location
  'endLng': -122.4533 // Longitude of the ending location
};

apiInstance.getCost(37.7763, -122.3918, opts).then((data) => {
  console.log(data);
}, (error) => {
  console.error(error);
});
