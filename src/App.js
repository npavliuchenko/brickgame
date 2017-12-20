import React from 'react';

import Screen from './components/Screen';
import Button from './components/Button';

import './App.scss';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: null
    };
  }

  render() {
    return (
      <div className="app">
        <Screen />

        <div className="controls">
          <div className="game-controls">
            <Button type="start" />
          </div>

          <div className="move-controls">
            <Button type="left" />
            <Button type="down" />
            <Button type="right" />
          </div>

          <div className="action-controls">
            <Button type="rotate" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
