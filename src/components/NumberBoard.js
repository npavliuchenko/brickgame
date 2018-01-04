import React from 'react';
// import './Board.scss';



class NumberBoard extends React.Component {
  translate(source) {
    //  -0-
    // 1   2
    //  -3-
    // 4   5
    //  -6-
    const placeholder = ' ';
    const translationMap = {
      // #  0 1 2 3 4 5 6
      '0': [1,1,1,0,1,1,1],
      '1': [0,0,1,0,0,1,0],
      '2': [1,0,1,1,1,0,1],
      '3': [1,0,1,1,0,1,1],
      '4': [0,1,1,1,0,1,0],
      '5': [1,1,0,1,0,1,1],
      '6': [1,1,0,1,1,1,1],
      '7': [1,0,1,0,0,1,0],
      '8': [1,1,1,1,1,1,1],
      '9': [1,1,1,1,0,1,1],

      ' ': [0,0,0,0,0,0,0],
      'p': [1,1,1,1,1,0,0],
      'a': [1,1,1,1,1,1,0],
      'u': [0,1,1,0,1,1,1],
      's': [1,1,0,1,0,1,1],
      'e': [1,1,0,1,1,0,1],
    };

    let result = [];
    const prepared = source.toString().toLowerCase();

    // console.log(source, prepared, prepared.length);

    for (let i = 0; i < prepared.length; i++) {
      let digit = translationMap.hasOwnProperty(prepared[i]) ? prepared[i] : placeholder;
      let digitConverted = translationMap[digit];

      result.push(digitConverted);
      // console.log(digit, digitConverted);
    }

    return result;
  }

  render() {
    console.log(this.props.content);

    // this.translate(0);
    // this.translate(1);
    // this.translate('2');
    // this.translate(3.5);
    // this.translate('4A');
    // this.translate('5a');

    // if (!Array.isArray(this.props.content) || !this.props.content.length) {
    //   return null;
    // }

    const encoded = this.translate(this.props.content);

    return (
      <div className={'number ' + this.props.className}>
        {encoded.map((digit, i) =>
          <div className="digit" key={i}>
            {digit.map((segment, j) =>
              <div key={j} className={'segment' + j + ' ' + (segment ? 'active' : 'passive')}></div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default NumberBoard;
