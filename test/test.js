// MODULES //

var chai = require( 'chai' ),
    kurtosis = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
    assert = chai.assert;


// TESTS //

describe( 'compute-kurtosis', () => {
  'use strict';

  it( 'should export a function', () => {
    expect( kurtosis ).to.be.a( 'function' );
  });

  it( 'should throw an error if provided a non-array', () => {
    var values = [
      '5',
      5,
      true,
      undefined,
      null,
      NaN,
      function(){},
      {}
    ];

    for ( var i = 0; i < values.length; i++ ) {
      expect( badValue( values[i] ) ).to.throw( TypeError );
    }
    function badValue( value ) {
      return function() {
	kurtosis( value );
      };
    }
  });

  it( 'should compute the sample excess kurtosis', () => {
    var scores = [ 61, 64, 67, 70, 73 ],
	freq = [ 5, 18, 42, 27, 8 ],
	idx = 0,
	data = [],
	expected;

    for ( var i = 0; i < scores.length; i++ ) {
      for ( var j = 0; j < freq[ i ]; j++ ) {
	data.push( scores[ i ] );
	idx += 1;
      }
    }
    expected = -0.2091;

    assert.closeTo( kurtosis( data ), expected, 0.001 );
  });

  // https://en.wikipedia.org/wiki/Kurtosis
  xit('Wikipedia: Kurtosis (sample excess kurtosis)', () => {
    const data = [0, 3, 4, 1, 2, 3, 0, 2, 1, 3, 2, 0, 2, 2, 3, 2, 5, 2, 3, 999]
          .map(e => parseInt(e, 10));
    console.log(data);
    const actual = kurtosis(data);
    const expected = 15.05;
    assert.closeTo(actual, expected, 0.01);
  });


  // https://www.mathworks.com/help/stats/kurtosis.html
  it('MathWorks: Kurtosis (non-excess)', () => {
    const data = `
     1.1650  1.6961  -1.4462  -0.3600
  0.6268  0.0591  -0.7012  -0.1356
  0.0751  1.7971  1.2460  -1.3493
  0.3516  0.2641  -0.6390  -1.2704
  -0.6965  0.8717  0.5774  0.9846
`
          .trim()
          .match(/\S+/g)
          .map(e => parseFloat(e));


    const actual = kurtosis(data) + 3;
    const expected = 2.1658;
    assert.closeTo(actual, expected, 0.1);
  });



  // https://brownmath.com/stat/shape.htm#KurtosisCompute
  it('College Men\'s Heights (sample excess kurtosis)', () => {
    let data = `
59.5–62.5	61	5
62.5–65.5	64	18
65.5–68.5	67	42
68.5–71.5	70	27
71.5–74.5	73	8
`
        .trim()
        .split('\n')
        .map(e => e.trim())
        .map(row => {
          const data = row.split('	');
          const classMark = parseInt(data[1], 10);
          const freq = parseInt(data[2], 10);
          const result = (new Array(freq)).fill(classMark);

          return result;
        })
        .reduce((p, c) => {
          return p.concat(c);
        }, []);

    const actual = kurtosis(data);
    const expected = -0.2091;
    assert.closeTo(actual, expected, 0.001);

  });

  // https://brownmath.com/stat/shape.htm#KurtosisCompute
  it('Rat Litter Size (sample excess kurtosis)', () => {
    let table = `
LitterSize	1	2	3	4	5	6	7	8	9	10	11	12
Frequency	7	33	58	116	125	126	121	107	56	37	25	4
`
        .trim()
        .split('\n')
        .map(e => e.trim())
        .map(row => {
          const data = row.match(/\S+/g);
          data.shift();
          return data;
        });
    let litters = table[0];
    let freq = table[1];

    let data = freq
        .map(e => parseInt(e, 10))
        .reduce((p, c, i, a) => {
          let size = parseInt(litters[i], 10);
          let litter = (new Array(c)).fill(null).map(e => size);
          console.log(c, size, litter);
          return p.concat(litter);
        }, []);

    // n = 815, x̅ = 6.1252, m2 = 5.1721, m3 = 2.0316
    assert.equal(data.length, 815);

    const actual = kurtosis(data);
    // kurtosis a4 = m4 / m2² = 67.3948 / 5.1721² = 2.5194
    // excess kurtosis g2 = 2.5194−3 = −0.4806
    // sample excess kurtosis G2 = [814/(813×812)] [816×(−0.4806+6) = −0.4762
    const expected = -0.4762;
    assert.closeTo(actual, expected, 0.001);
  });


  xit('should handle single value distributions', () => {
    const data = (new Array(10)).fill(null).map(e => 1);
    console.log(data);
    const actual = kurtosis(data);

    const expected = 0;
    assert.closeTo(actual, expected, 0.001);
  });

  // Examples from
  // https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4321753/pdf/nihms-599845.pdf
  xit('should handle triangle', () => {
    const actual = 0;
    const expected = 2.4;
    assert.closeTo(actual, expected, 0.001);
  });

  xit('should handle Devil\'s tower', () => {
    const actual = 0;
    const expected = 2.4;
    assert.closeTo(actual, expected, 0.001);
  });

  xit('should handle Slip-dress', () => {
    const actual = 0;
    const expected = 2.4;
    assert.closeTo(actual, expected, 0.001);
  });



});
