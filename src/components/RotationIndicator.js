import React from 'react';



class RotationIndicator extends React.Component {
  render() {
    const ccwClass = this.props.content === 'ccw' ? 'active' : 'passive';
    const cwClass =  this.props.content === 'cw'  ? 'active' : 'passive';

    return (
      <div className="rotate-direction">
        <div className={'arrow ccw ' + ccwClass}></div>
        <div className={'arrow cw ' + cwClass}></div>
      </div>
    );
  }
}

export default RotationIndicator;
