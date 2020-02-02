import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import {Button, Grid} from 'rsuite';
// import 'rsuite/dist/styles/rsuite-dark.min.css'; // or
import ChartTile from './ChartTile'

const addMinsToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
}

let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InNnaXAiLCJpYXQiOjE1ODA2MDIyNTgsImV4cCI6MTU4MDYwNDA1OCwiaXNzIjoiV2F0dFRpbWUiLCJzdWIiOiJqYWNrc29uaGVycm9uIn0.G8fj2hDrnnwYVszdH1qoakxBq1B2iAmFlSMtZJheeM0zzFSZxAMnrMpaFllTuPwMWntIYKrlJburq2SACsE7gTZaXXUBKbTbvr5KtTKH6TK8UxubOFSbw97ZXAkUq3L0l3bB6j9MfsKigcvTEB01UWaBPrygAn1u7RIWN8753fQNHp6o7cmfVMjy2RUn_EXcM7PHBNijo9WOIiHI3dnAGeNpN90CHQAPqCBCY0Gi5LRTbC4LtsV7WaeoFWVqkYp6x0vvXwczDsEvfzY-vO7VnTo5NRb8xoSPO2e0W_HA7VN8ILyZYO3tJWG4D1T3s94jPm85_AYPEX-krmCahg3pFQ'

let requestHeaders =
    {
        headers: {
          'Authorization': 'Bearer ' + token,
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
    CO2Intensity: 0,
    chartsLoading:true,
    buffer:null
  };

  async handleRetrievePriceData() {

  }

  async handleRetrieveCO2Data() {
    let APIURL = `https://cors-anywhere.herokuapp.com/https://sgipsignal.com/sgipmoer/?ba=SGIP_CAISO_PGE&starttime=${this.state.now}&endtime=${this.state.fiveMinsFromNow}`;
    let data = await axios.get(APIURL, requestHeaders)
      .then((res) => {
        console.log(res);
        if (res.data.length !== 0){
          let moer = res.data[0].moer;
          let moer_normalized = moer/0.7*100;
          return moer_normalized
        }
        else {
          return 50;
        }
      })
      .catch((err) => {
        console.log(err)
        return 0
      });

      let buff = [];
      buff.push(<ChartTile Data={[50]} label="c/kWh" color={'#000088'} colorTo={"#bb0000"} className="chart"/>);
      buff.push(
      <ChartTile Data={[data]} label="GHG Intensity" color={'#008800'} colorTo={"#000000"} className="chart"/>);

      this.setState({buffer:buff,
      chartsLoading:false})
  }

  async componentDidMount() {
    this.handleRetrieveCO2Data()
    // this.handleRetrievePriceData()
  }


  render(){
    const text = this.state.chartsLoading ? "Loading...": ""
    return (

      <div className="App">
        <div className="title">
          <h1>Welcome to <span id="Odin">Odin</span></h1>
          <div>Real-time electricity pricing and emissions intensity information</div>
          <div id="tagline">Control what you pay for electricity</div>
        </div>
        <div className="chartContainer">
            {text}
            {this.state.buffer}
        </div>
        <div id="OdinAPI">Developer? Check out OdinAPI for the complete API documentation</div>
      </div>
    );
  };
};

export default App;
