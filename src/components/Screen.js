import React from 'react';
import './Screen.scss';
import SvgOrnament from './SvgOrnament';
// import {ReactComponent as Ornament} from '../img/ornament.svg';
// import svgOrnament from '../img/ornament.raw.svg';



class Screen extends React.Component {
  render() {
    return (
      <div className="screen">
        <SvgOrnament className="decor-left" />
        <SvgOrnament className="decor-right" />
        <div className="board"></div>
        <div className="score"></div>
        <div className="next"></div>
        <div className="speed"></div>
        <div className="level"></div>
        <div className="rotate"></div>
      </div>
    );
  }
}

export default Screen;
