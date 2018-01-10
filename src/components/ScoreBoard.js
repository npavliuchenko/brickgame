import React from 'react';

import {SCORE_DIGITS, SCORE_BLINK_DELAY} from '../utils/constants';
import NumberBoard from './NumberBoard';
// import './NumberBoard.scss';



class ScoreBoard extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.texts = [''];
    this.state = { index: 0 };

    this.initState(props.content);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.initState(nextProps.content);
    this.setState({ index: 0 });
  }

  initState(content) {
    const contentArray = content !== null && content !== undefined
      ? (Array.isArray(content) ? content : [content])
      : [''];

    // console.log(contentArray);

    this.texts = contentArray.map(this.formatValue);
    // console.log(this.texts);

    if (contentArray.length === 1) {
      if (this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    } else {
      if (this.timer === null) {
        this.timer = setInterval(() => {
          this.setState((prevState) => ({
            index: (prevState.index + 1) % this.texts.length
          }));
        }, SCORE_BLINK_DELAY);
      }
    }
  }

  formatValue(val) {
    const str = val.toString();
    // console.log(val, str, SCORE_DIGITS - str.length);
    return ' '.repeat(SCORE_DIGITS - str.length) + str;
  }

  //@TODO: marquee
  //@TODO: switch

  render() {
    // const str = this.props.content.toString();
    // const formatted = ' '.repeat(SCORE_DIGITS - str.length) + str;
    // console.log(this.props.content, formatted);

    return (
      <NumberBoard content={this.texts[this.state.index]} className="score" />
    );
  }
}

export default ScoreBoard;
