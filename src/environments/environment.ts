// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    accessToken: 'pk.eyJ1IjoiZXZhbGxnYXIiLCJhIjoiY2l1cnc2aDRxMDBiYzJ1cHZqdWFlODdseiJ9._lOalqIZflhz0YQosjx-zw'
  },
  firebaseConfig: {
    apiKey: "AIzaSyAOjaBXSmdEGU3cav9CLc6We4CZhwr89cM",
    authDomain: "bus2u-dev.firebaseapp.com",
    databaseURL: "https://bus2u-dev.firebaseio.com",
    projectId: "bus2u-dev",
    storageBucket: "bus2u-dev.appspot.com",
    messagingSenderId: "716902039021",
    appId: "1:716902039021:web:54f3dbd02d9bc1a89fbbe4",
    measurementId: "G-88Y68T9LZP",
    github: '3xspkvs2bzw7tpdnr3l3oda54pfkhjy7g5e4zgolo7xdxexupqnq'
    // apiKey: 'AIzaSyAZGkb8xn1XfcSJWeC-gSpOji2vlBrToLw',
    // authDomain: 'bus2u-834e8.firebaseapp.com',
    // databaseURL: 'https://bus2u-834e8.firebaseio.com',
    // projectId: 'bus2u-834e8',
    // storageBucket: 'bus2u-834e8.appspot.com',
    // messagingSenderId: '93998955183',
    // appId: '1:93998955183:web:d336bc01c0973e95'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
