import React, {Component} from 'react';
import Chart from "react-apexcharts";
import Grid from '@material-ui/core/Grid';


class LevelTile extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            stageCount:this.props.stageCount,
            curLvl:0,
            labelLvl:1,
            data:props.progData,
            series: [44, 55, 67],
            options: {
                chart: {
                    type: 'radialBar',
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 135,
                        dataLabels: {
                            name: {
                                fontSize: '11px',
                            },
                            value: {
                                fontSize: '8px',
                            },
                            total: {
                                show: true,
                                label: 'Level',
                                formatter: function (w) {
                                    // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                    return w.level
                                }
                            }
                        }
                    }
                },
                labels: ['C/KWh', 'CO2'],
            }
        }
    }

    right = () => {
        if(this.state.curLvl+1 > this.props.level.length-1)
        {

        }
        else
        {
            let newLvl = this.state.curLvl;
            let newLablLevel = this.state.labelLvl;
            newLablLevel++;
            newLvl++;
            this.setState({
                curLvl: newLvl,
                labelLvl: newLablLevel
            }, this.updateChart);
        }

    };

   left = () => {
       if(this.state.curLvl === 0)
       {

       }
       else {
           let newLvl = this.state.curLvl;
           let newLablLevel = this.state.labelLvl;
           newLablLevel--;
           newLvl--;
           this.setState({
               curLvl: newLvl,
               labelLvl: newLablLevel
           }, this.updateChart);
       }


    };

    updateChart = () => {

        let chartBuffer = [];

        let x = {
            chart: {
                height: "100",
                width:"50px",
                type: 'radialBar'
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    dataLabels: {
                        name: {
                            fontSize: '11px',
                        },
                        value: {
                            fontSize: '8px',
                        },
                        total: {
                            show: true,
                            label: this.state.labelLvl,
                            formatter: function (w) {
                                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                return "";
                            }
                        }
                    }
                }
            },
            labels: ['C/KWh', 'CO2'],
        };

        chartBuffer.push(


            <Grid container key={5321}>

                <Grid item xs={6} style={{margin: 0}}>
                    <div>
                    <Chart options={x} series={[80,50,70]} type="radialBar"  width={300} height={250}  />
                    </div>
                </Grid>
                <Grid item xs={1}>

                </Grid>

                <Grid item xs={3}>
                   -
                </Grid>
            </Grid>
        );

        this.setState({buff:chartBuffer})

    };


    componentDidMount() {
        this.updateChart();
    }

    render() {
        return (

                <h1>{this.state.buff}</h1>

        );
    }
}

export default LevelTile;