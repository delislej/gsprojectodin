import React from 'react';
import './App.css';
import {Button, Grid} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.min.css'; // or
import ChartTile from './ChartTile'



function App() {
  return (
    <div className="App">



        <div className="chartContainer">
            <ChartTile Data={[50]} label="c/kWh" className="chart"/>
            <ChartTile Data={[100]} label="CO2" className="chart"/>
        </div>



    </div>
  );
}

export default App;
