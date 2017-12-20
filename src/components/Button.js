import React from 'react';

import './Button.scss';



class Button extends React.Component {
  render() {
    var label;

    switch (this.props.type) {
        case 'start' : {
            label = 'start / pause';
            break;
        }
        default: {
            label = this.props.type;
        }
    }

    return (
        <button className={this.props.type}>
            <span>{label}</span>
        </button>
    );
  }
}

export default Button;
