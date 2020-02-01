import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import {Button, Grid} from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.min.css'; // or
import ChartTile from './ChartTile'

const addMinsToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
}

let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InNnaXAiLCJpYXQiOjE1ODA1OTk0MjcsImV4cCI6MTU4MDYwMTIyNywiaXNzIjoiV2F0dFRpbWUiLCJzdWIiOiJqYWNrc29uaGVycm9uIn0.ECIEgaXKZHVl6ZuJv9-ET60gH9huySwAEh6y0jzHhLVGAleQ8jIB2SdvF_EgQ5f-X-ZpzOmq-e8V1DV58imGxP3bIqYSOfhll8s-yS6VY5_8jeufnEp3TTHsriJ2bIQ3mVHlVF9zQI7cTSvbfuZ8yd5-Rr6sjGv3dZowSo8q3JZC_O6gVLfPPf4Sc58_vN7LHKq8GfVe1x6LPPJSWBrTifaZ4rSmTYnFR6qZhAQiAVymKmtVta_rpwTEQoSqpDauiexCcNs4VvT6vK8Jg93j-afXh9WdFRUndakMWS2MA-bM-0j9NXzk5J-jLTRuzCTxvV8trmITthXCMxAen6fYSA'

let requestHeaders =
    {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Access-Control-Allow-Origin': '*'
        }
    };

// const APIURL = `https://sgipsignal.com/sgipmoer/?ba=SGIP_CAISO_PGE&starttime=${start_time}&endtime=${end_time}`;

class App extends Component {
  state = {
    currentUser: localStorage.getItem('user'),
    showLogin: false,
    showSignup: false,
    now: new Date().toISOString(),
    fiveMinsFromNow: addMinsToDate(new Date(), 5).toISOString(),
  };


  handleRetrieveCO2Data = () => {
    let APIURL = `https://sgipsignal.com/sgipmoer/?ba=SGIP_CAISO_PGE&starttime=${this.state.now}&endtime=${this.state.fiveMinsFromNow}`;
    axios.get(APIURL, requestHeaders)
      .then((res) => {
        console.log(res)
      })
  }

  componentDidMount = () => {
    this.handleRetrieveCO2Data()
  }


  render(){
    return (
    
      <div className="App">
          <div className="chartContainer">
              <ChartTile Data={[50]} label="c/kWh" className="chart"/>
              <ChartTile Data={[100]} label="CO2" className="chart"/>
          </div>
  
      </div>
    );
  };
};

export default App;
