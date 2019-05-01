import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ToneBoard    from './ToneBoard';
import BigToneBoard from './BigToneBoard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ToneBoard/>
        <BigToneBoard/>

      </div>
    );
  }
}

export default App;
