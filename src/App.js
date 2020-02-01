import React from 'react';
import './App.css';
import { Button } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'; // or
import ChartTile from './ChartTile'

function App() {
  return (
    <div className="App">
      <p>place holder</p>
        <Button>I'm a button</Button> <Button>I'm a button</Button> <Button>I'm a button</Button>

        <ChartTile/>

    </div>
  );
}

export default App;
