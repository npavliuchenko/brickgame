import React from 'react';

import './Button.scss';



class Button extends React.Component {
  render() {
    var label;

    switch (this.props.type) {
        case 'start' : {
            label = 'start pause';
            break;
        }
        case 'left' : {
            label = 'left level';
            break;
        }
        case 'right' : {
            label = 'right speed';
            break;
        }
        default: {
            label = this.props.type;
        }
    }

    return (
        <button
            className={this.props.type}
            onClick={this.props.onShortPress}
            onMouseDown={this.props.onLongPress}
            onMouseUp={this.props.onLongPress}
        >
            <span>{label}</span>
        </button>
    );
  }
}

export default Button;
