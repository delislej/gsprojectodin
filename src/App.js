import React from 'react';
import './App.css';
import {Button, Grid} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'; // or
import ChartTile from './ChartTile'



function App() {
  return (
    <div className="App">
      <p>place holder</p>
        <Button>I'm a button</Button> <Button>I'm a button</Button> <Button>I'm a button</Button>

        <Grid>
        <Grid item lg={12}>
        <ChartTile Data={[10,20,30]}/>
        </Grid>

         <Grid item lg={12}>
          <ChartTile Data={[20,40,60]}/>
         </Grid>

        </Grid>
    </div>
  );
}

export default App;
