var kurtosis = require( './../lib' );

var histogram = require('ascii-histogram');


// bound 0...1 between 0...b
let bound = (n, b = 20) => {
  return Math.floor(n * b);
};

let tests = [
  {
    name: "normal", // 0...1 normal
    rand:  () => {
      var rand = 0;

      for (var i = 0; i < 6; i += 1) {
        rand += Math.random();
      }
      return rand / 6;
    }
  },
  {
    name: "random", // 0...1
    rand:  () => {
      return Math.random();
    }
  }
];

tests.map(test => {

  const data = (new Array(10000))
        .fill(null)
        .map(e => test.rand())
        .map(e => bound(e, 25))
        .sort((a, b) => a - b);


  const dist = data
        .reduce((p, c) => {
          p[c] = p[c] ? ++p[c] : 1;
          return p;
        }, {});

  console.log('--------------', test.name, '--------------');
  console.log(histogram(dist));
  console.log('kurtosis', kurtosis( data ));
});
